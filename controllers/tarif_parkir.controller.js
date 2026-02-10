import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import { tarifParkirSchema, tarifPerjam } from "@/lib/validations/tarif.schema";
import { validateRequest } from "@/lib/validations/validaterequest";
import { float32 } from "zod";

const TarifParkirController = {
  async create({ jenis_kendaraan, tarif_per_jam }) {
    try {
      const validation = validateRequest(tarifParkirSchema, {
        jenis_kendaraan,
        tarif_per_jam,
      });

      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const tarif = await prisma.tb_tarif.create({
        data: {
          jenis_kendaraan,
          tarif_per_jam,
        },
      });
      return response.created(tarif, "Tafir Parkir Berhasil Dibuat");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async findAll({ page = 1, limit = 10, search }) {
    try {
      const where = search
        ? {
            OR: [
              {
                tarif_per_jam: {
                  contains: search,
                },
              },
            ],
          }
        : {};

      const [data, total] = await Promise.all([
        prisma.tb_tarif.findMany({
          where,
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
        }),
        prisma.tb_tarif.count({ where }),
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
      const existing = await prisma.tb_tarif.findUnique({
        where: { id_tarif: id },
      });

      if (!existing) {
        return response.notFound("Data Area Parkir Tidak Ditemukan");
      }
      const tarif = await prisma.tb_tarif.findFirst({
        where: { id_tarif: id },
        select: {
          id_tarif: true,
          jenis_kendaraan: true,
          tarif_per_jam: true,
        },
      });

      return response.success(tarif, "Data Berhasil Ditemukan");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async update(body, id) {
    try {
      const { tarif_per_jam } = body;
      const id_tarif = Number(id);

      const validation = validateRequest(tarifPerjam, { tarif_per_jam });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const existing = await prisma.tb_tarif.findUnique({
        where: { id_tarif },
      });

      if (!existing) {
        return response.notFound("Data Tarif Parkir Tidak Ditemukan");
      }
      const area = await prisma.tb_tarif.update({
        where: { id_tarif },
        data: {
          tarif_per_jam,
        },
      });

      if (!area) {
        return response.notFound("Data Tidak Ditemukan");
      }

      return response.created(area, "Tarfi Parkir Berhasil Di Update");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async remove({ id }) {
    try {
      const existing = await prisma.tb_tarif.findUnique({
        where: { id_tarif: id },
      });

      if (!existing) {
        return response.notFound("Data Tarif Parkir Tidak Ditemukan");
      }

      const area = await prisma.tb_tarif.delete({
        where: { id_tarif: id },
        select: {
          jenis_kendaraan: true,
          tarif_per_jam: true,
        },
      });

      return response.success(area, "Data Tarif Parkir Berhasil Dihapus");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
};

export default TarifParkirController;
