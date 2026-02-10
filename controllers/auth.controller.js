import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";

const AuthController = {
  async LoginController({ identifier, password }) {
    const user = await prisma.tb_user.findFirst({
      where: {
        username: identifier
      },
    });

    if (!user) {
      return {
        status: false,
        message: "User tidak ditemukan",
      };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        status: false,
        message: "Password Tidak Cocok",
      };
    }

    const now = new Date();
    const wibOffset = 7 * 60 * 60 * 1000; // UTC+7
    const wibDate = new Date(now.getTime() + wibOffset);

    await prisma.tb_log_aktivitas.create({
      data: {
        aktivitas: `User Bernama ${user.nama_lengkap} Telah Login`,
        waktu_aktivitas: wibDate,
        id_user: user.id_user,
      },
    });

    return {
      status: true,
      data: {
        user,
      },
    };
  },
  async RegisterUserController(body) {
    try {
      // const parsed = registerSchema.safeParse(body);

      // if (!parsed.success) {
      //   return response.validationError(parsed.error);
      // }

      const { username, password, role, nama_lengkap } = body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.tb_user.create({
        data: {
          nama_lengkap,
          username,
          password: hashedPassword,
          role,
        },
        select: {
          id_user: true,
          username: true,
          role: true,
        },
      });

      return response.created(user, "Registrasi Berhasil");
    } catch (error) {
      console.error(error);
      return response.serverError("Internal Server Error");
    }
  },
};

export default AuthController;
