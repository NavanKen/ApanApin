import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";

const AktivitasController = {
  async findAll({ page = 1, limit = 10, search }) {
    try {
      const condition = [];

      if (search) {
        condition.push({
          OR: [
            {
              aktivitas: {
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
        prisma.tb_log_aktivitas.findMany({
          where, orderBy: {
            waktu_aktivitas: "desc",
          },
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
        }),
        prisma.tb_log_aktivitas.count({ where }),
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
};

export default AktivitasController;
