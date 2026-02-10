import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import { kendaraanSchema } from "@/lib/validations/kendaraan.schema";
import { validateRequest } from "@/lib/validations/validaterequest";

const KendaraanController = {
  async create({ plat_nomor, jenis_kendaraan, pemilik, warna }) {
    try {
      const validation = validateRequest(kendaraanSchema, {
        plat_nomor,
        jenis_kendaraan,
        pemilik,
        warna,
      });

      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const kendaraan = await prisma.tb_kendaraan.create({
        data: {
          plat_nomor,
          jenis_kendaraan,
          pemilik,
          warna,
        },
      });
      return response.created(kendaraan, "Kendaraan Berhasil Dibuat");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async findAll({ page = 1, limit = 10, search }) {
    try {
      const condition = [];

      if (search) {
        condition.push({
          OR: [
            {
              pemilik: {
                contains: search,
              },
            },
            {
              plat_nomor: {
                contains: search,
              },
            },
          ],
        });
      }
      // const where = search
      //   ? {
      //       OR: [
      //         {
      //           nama_lengkap: {
      //             contains: search,
      //           },
      //         },
      //         {
      //           username: {
      //             contains: search,
      //           },
      //         },
      //       ],
      //     }
      //   : {};

      const where = condition.length > 0 ? { AND: condition } : {};

      const [data, total] = await Promise.all([
        prisma.tb_kendaraan.findMany({
          where,
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
        }),
        prisma.tb_kendaraan.count({ where }),
      ]);

      return response.pagination(
        data,
        {
          total,
          totalPages: Math.ceil(total / limit),
          current: Number(page),
        },
        "Berhasil Mendapatkan Semua Data",
      );
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async findOne({ id }) {
    try {
      const existing = await prisma.tb_kendaraan.findUnique({
        where: { id_kendaraan: id },
      });

      if (!existing) {
        return response.notFound("Data Kendaraan Tidak Ditemukan");
      }
      const kendaraan = await prisma.tb_kendaraan.findFirst({
        where: { id_kendaraan: id },
        select: {
          jenis_kendaraan: true,
          pemilik: true,
          warna: true,
          plat_nomor: true,
        },
      });

      return response.success(kendaraan, "Data Kendaraa Berhasil Ditemukan");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async update(body, id) {
    try {
      const { plat_nomor, jenis_kendaraan, pemilik, warna } = body;
      const id_kendaraan = Number(id);

      const validation = validateRequest(kendaraanSchema, {
        plat_nomor,
        jenis_kendaraan,
        pemilik,
        warna,
      });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const existing = await prisma.tb_kendaraan.findUnique({
        where: { id_kendaraan },
      });

      if (!existing) {
        return response.notFound("Data Kategori Tidak Ditemukan");
      }
      const kendaraan = await prisma.tb_kendaraan.update({
        where: { id_kendaraan },
        data: {
          plat_nomor,
          jenis_kendaraan,
          pemilik,
          warna,
        },
      });

      if (!kendaraan) {
        return response.notFound("Data Tidak Ditemukan");
      }

      return response.created(kendaraan, "User Berhasil Di Update");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async remove({ id }) {
    try {
      const existing = await prisma.tb_kendaraan.findUnique({
        where: { id_kendaraan: id },
      });

      if (!existing) {
        return response.notFound("Data Kendaraan Tidak Ditemukan");
      }

      const kendaraan = await prisma.tb_kendaraan.delete({
        where: { id_user: id },
        select: {
          jenis_kendaraan: true,
          pemilik: true,
          warna: true,
          plat_nomor: true,
        },
      });

      return response.success(kendaraan, "Data Kendaraan Berhasil Dihapus");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
};

export default KendaraanController;
