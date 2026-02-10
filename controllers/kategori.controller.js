import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import {
  createKategoriSchema,
  updateKategoriSchema,
} from "@/lib/validations/kategori.validation";
import { validateRequest } from "@/lib/validations/validaterequest";

const KategoriController = {
  async create({ nama_kategori, deskripsi, image }) {
    try {
      // Validasi dengan Zod
      const validation = validateRequest(createKategoriSchema, {
        nama_kategori,
        deskripsi,
        image,
      });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const kategori = await prisma.kategori.create({
        data: {
          nama_kategori,
          deskripsi,
          image,
        },
      });
      return response.created(kategori, "Success create Category");
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
                nama_kategori: {
                  contains: search,
                },
              },
            ],
          }
        : {};

      const [data, total] = await Promise.all([
        prisma.kategori.findMany({
          where,
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
        }),
        prisma.kategori.count({ where }),
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
      const existing = await prisma.kategori.findUnique({
        where: { id_kategori: id },
      });

      if (!existing) {
        return response.notFound("Data Kategori Tidak Ditemukan");
      }
      const kategori = await prisma.kategori.findFirst({
        where: { id_kategori: id },
        select: {
          id_kategori: true,
          nama_kategori: true,
          deskripsi: true,
          image: true,
        },
      });

      return response.success(kategori, "Data Berhasil Ditemukan");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async update(body, id) {
    try {
      const { nama_kategori, deskripsi, image } = body;
      const id_kategori = Number(id);

      // Validasi dengan Zod
      const validation = validateRequest(updateKategoriSchema, {
        nama_kategori,
        deskripsi,
        image,
      });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const existing = await prisma.kategori.findUnique({
        where: { id_kategori },
      });

      if (!existing) {
        return response.notFound("Data Kategori Tidak Ditemukan");
      }
      const kategori = await prisma.kategori.update({
        where: { id_kategori },
        data: {
          nama_kategori,
          deskripsi,
          image,
        },
      });

      if (!kategori) {
        return response.notFound("Data Tidak Ditemukan");
      }

      return response.created(kategori, "Kategori Berhasil Di Update");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async remove({ id }) {
    try {
      const existing = await prisma.kategori.findUnique({
        where: { id_kategori: id },
      });

      if (!existing) {
        return response.notFound("Data Kategori Tidak Ditemukan");
      }

      const kategori = await prisma.kategori.delete({
        where: { id_kategori: id },
        select: {
          id_kategori: true,
          nama_kategori: true,
        },
      });

      return response.success(kategori, "Data Kategori Berhasil Dihapus");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
};

export default KategoriController;
