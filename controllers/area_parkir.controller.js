import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import { areaParkirSchema } from "@/lib/validations/area_parkir.schema";
import { validateRequest } from "@/lib/validations/validaterequest";

const AreaParkirController = {
  async create({ nama_area, kapasitas }) {
    try {
      const validation = validateRequest(areaParkirSchema, {
        nama_area,
        kapasitas,
      });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }
      const kapasitasConvert = Number(kapasitas);
      const area = await prisma.tb_area_parkir.create({
        data: {
          nama_area,
          kapasitas: kapasitasConvert,
        },
      });
      return response.created(area, "Area Parkir Berhasil Dibuat");
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
                nama_area: {
                  contains: search,
                },
              },
            ],
          }
        : {};
      const [data, total] = await Promise.all([
        prisma.tb_area_parkir.findMany({
          where,
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
        }),
        prisma.tb_area_parkir.count({ where }),
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
      const existing = await prisma.tb_area_parkir.findUnique({
        where: { id_area: id },
      });
      if (!existing) {
        return response.notFound("Data Area Parkir Tidak Ditemukan");
      }
      const area = await prisma.tb_area_parkir.findFirst({
        where: { id_area: id },
        select: {
          id_area: true,
          kapasitas: true,
          nama_area: true,
          terisi: true,
        },
      });
      return response.success(area, "Data Berhasil Ditemukan");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async update(body, id) {
    try {
      const { nama_area, kapasitas } = body;
      const id_area = Number(id);
      const validation = validateRequest(areaParkirSchema, {
        nama_area,
        kapasitas,
      });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }
      const existing = await prisma.tb_area_parkir.findUnique({
        where: { id_area },
      });
      if (!existing) {
        return response.notFound("Data Area Parkir Tidak Ditemukan");
      }
      const convertKapasitas = Number(kapasitas);
      const area = await prisma.tb_area_parkir.update({
        where: { id_area },
        data: {
          nama_area,
          kapasitas: convertKapasitas,
        },
      });
      if (!area) {
        return response.notFound("Data Tidak Ditemukan");
      }
      return response.created(area, "Area Parkir Berhasil Di Update");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async remove({ id }) {
    try {
      const existing = await prisma.tb_area_parkir.findUnique({
        where: { id_area: id },
      });
      if (!existing) {
        return response.notFound("Data Area Parkir Tidak Ditemukan");
      }
      const area = await prisma.tb_area_parkir.delete({
        where: { id_area: id },
        select: {
          id_area: true,
          nama_area: true,
          kapasitas: true,
          terisi: true,
        },
      });
      return response.success(area, "Data Area Parkir Berhasil Dihapus");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
};

export default AreaParkirController;
