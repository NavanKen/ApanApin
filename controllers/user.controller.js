import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import { userSchemaEdit, userSchema } from "@/lib/validations/auth.schema";
import { validateRequest } from "@/lib/validations/validaterequest";
import bcrypt from "bcryptjs";

const UserController = {
  async create({ nama_lengkap, username, password, confirmPassword, role }) {
    try {
      const validation = validateRequest(userSchema, {
        nama_lengkap,
        username,
        password,
        confirmPassword,
        role,
      });

      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.tb_user.create({
        data: {
          nama_lengkap,
          username,
          password: hashedPassword,
          role,
        },
      });
      return response.created(user, "User Berhasil Dibuat");
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
              nama_lengkap: {
                contains: search,
              },
            },
            {
              username: {
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
        prisma.tb_user.findMany({
          where,
          take: Number(limit),
          skip: (Number(page) - 1) * Number(limit),
        }),
        prisma.tb_user.count({ where }),
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
      const existing = await prisma.tb_user.findUnique({
        where: { id_user: id },
      });

      if (!existing) {
        return response.notFound("Data User Tidak Ditemukan");
      }
      const kategori = await prisma.tb_user.findFirst({
        where: { id_user: id },
        select: {
          id_user: true,
          nama_lengkap: true,
          username: true,
          role: true,
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
      const { nama_lengkap, username, role } = body;
      const id_user = Number(id);

      const validation = validateRequest(userSchemaEdit, {
        nama_lengkap,
        username,
        role,
      });
      if (!validation.success) {
        return response.validationError(validation.errors);
      }

      const existing = await prisma.tb_user.findUnique({
        where: { id_user },
      });

      if (!existing) {
        return response.notFound("Data Kategori Tidak Ditemukan");
      }
      const user = await prisma.tb_user.update({
        where: { id_user },
        data: {
          nama_lengkap,
          username,
          role,
        },
      });

      if (!user) {
        return response.notFound("Data Tidak Ditemukan");
      }

      return response.created(user, "User Berhasil Di Update");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
  async remove({ id }) {
    try {
      const existing = await prisma.tb_user.findUnique({
        where: { id_user: id },
      });

      if (!existing) {
        return response.notFound("Data User Tidak Ditemukan");
      }

      const user = await prisma.tb_user.delete({
        where: { id_user: id },
        select: {
          id_user: true,
          nama_lengkap: true,
          role: true,
        },
      });

      return response.success(user, "Data User Berhasil Dihapus");
    } catch (error) {
      console.error(error);
      return response.serverError();
    }
  },
};

export default UserController;
