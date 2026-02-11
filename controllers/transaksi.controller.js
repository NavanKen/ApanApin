import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import { transaksiSchema } from "@/lib/validations/transaksi.schema";
import { validateRequest } from "@/lib/validations/validaterequest";

const TransaksiController = {
  async create({ id_kendaraan, id_area, id_user }) {
    try {
      const validation = validateRequest(transaksiSchema, {
        id_kendaraan: Number(id_kendaraan),
        id_area: Number(id_area),
      });

      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const kendaraan = await prisma.tb_kendaraan.findUnique({
        where: { id_kendaraan: Number(id_kendaraan) },
      });

      if (!kendaraan) {
        return response.notFound("Kendaraan Tidak Ditemukan");
      }

      const tarif = await prisma.tb_tarif.findFirst({
        where: { jenis_kendaraan: kendaraan.jenis_kendaraan },
      });

      if (!tarif) {
        return response.notFound(
          `Tarif untuk kendaraan ${kendaraan.jenis_kendaraan} belum diatur`,
        );
      }

      const area = await prisma.tb_area_parkir.findUnique({
        where: { id_area: Number(id_area) },
      });

      if (!area) {
        return response.notFound("Area Parkir Tidak Ditemukan");
      }

      if ((area.terisi || 0) >= area.kapasitas) {
        return response.error("Area Parkir Sudah Penuh");
      }

      const transaksi = await prisma.tb_transaksi.create({
        data: {
          id_kendaraan: Number(id_kendaraan),
          id_area: Number(id_area),
          id_user: Number(id_user),
          id_tarif: tarif.id_tarif,
          waktu_masuk: new Date(),
          status: "masuk",
          durasi_jam: 0,
          biaya_total: 0,
        },
        include: {
          kendaraan: true,
          tarif: true,
          area: true,
          user: {
            select: {
              id_user: true,
              nama_lengkap: true,
            },
          },
        },
      });

      await prisma.tb_area_parkir.update({
        where: { id_area: Number(id_area) },
        data: { terisi: (area.terisi || 0) + 1 },
      });

      return response.created(transaksi, "Transaksi Masuk Berhasil Dibuat");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },

  async findAll({
    page = 1,
    limit = 10,
    search,
    sort = "desc",
    status,
    startDate,
    endDate,
  }) {
    try {
      const condition = [];

      if (search) {
        condition.push({
          OR: [
            {
              kendaraan: {
                plat_nomor: { contains: search },
              },
            },
            {
              kendaraan: {
                pemilik: { contains: search },
              },
            },
            {
              area: {
                nama_area: { contains: search },
              },
            },
          ],
        });
      }

      if (status) {
        condition.push({ status });
      }

      if (startDate && endDate) {
        condition.push({
          waktu_masuk: {
            gte: new Date(startDate),
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
          },
        });
      } else if (startDate) {
        condition.push({
          waktu_masuk: {
            gte: new Date(startDate),
          },
        });
      } else if (endDate) {
        condition.push({
          waktu_masuk: {
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
          },
        });
      }

      const where = condition.length > 0 ? { AND: condition } : {};

      const orderBy = { createdAt: sort === "asc" ? "asc" : "desc" };

      const [data, total] = await Promise.all([
        prisma.tb_transaksi.findMany({
          where,
          orderBy,
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
          include: {
            kendaraan: true,
            tarif: true,
            area: true,
            user: {
              select: {
                id_user: true,
                nama_lengkap: true,
              },
            },
          },
        }),
        prisma.tb_transaksi.count({ where }),
      ]);

      return response.pagination(
        data,
        {
          total,
          totalPages: Math.ceil(total / limit),
          current: Number(page),
        },
        "Berhasil Mendapatkan Data Transaksi",
      );
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },

  async findOne({ id }) {
    try {
      const transaksi = await prisma.tb_transaksi.findUnique({
        where: { id_parkir: Number(id) },
        include: {
          kendaraan: true,
          tarif: true,
          area: true,
          user: {
            select: {
              id_user: true,
              nama_lengkap: true,
            },
          },
        },
      });

      if (!transaksi) {
        return response.notFound("Transaksi Tidak Ditemukan");
      }

      return response.success(transaksi, "Transaksi Berhasil Ditemukan");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },

  async updateKeluar({ id }) {
    try {
      const existing = await prisma.tb_transaksi.findUnique({
        where: { id_parkir: Number(id) },
        include: { tarif: true },
      });

      if (!existing) {
        return response.notFound("Transaksi Tidak Ditemukan");
      }

      if (existing.status === "keluar") {
        return response.error("Kendaraan Sudah Keluar");
      }

      const waktuKeluar = new Date();
      const waktuMasuk = new Date(existing.waktu_masuk);
      const diffMs = waktuKeluar - waktuMasuk;
      const durasiMenit = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
      const durasiJamBilling = Math.max(
        1,
        Math.ceil(diffMs / (1000 * 60 * 60)),
      );
      const biayaTotal =
        durasiJamBilling * Number(existing.tarif.tarif_per_jam);

      const transaksi = await prisma.tb_transaksi.update({
        where: { id_parkir: Number(id) },
        data: {
          waktu_keluar: waktuKeluar,
          durasi_jam: durasiMenit,
          biaya_total: biayaTotal,
          status: "keluar",
        },
        include: {
          kendaraan: true,
          tarif: true,
          area: true,
          user: {
            select: {
              id_user: true,
              nama_lengkap: true,
            },
          },
        },
      });

      await prisma.tb_area_parkir.update({
        where: { id_area: existing.id_area },
        data: {
          terisi: {
            decrement: 1,
          },
        },
      });

      return response.success(transaksi, "Kendaraan Berhasil Keluar");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
};

export default TransaksiController;
