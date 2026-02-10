import { prisma } from "@/lib/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    const id = Number(token.id);

    const user = await prisma.tb_user.findFirst({
      where: { id_user: id },
    });

    console.log("user", user);

    await prisma.tb_log_aktivitas.create({
      data: {
        aktivitas: `User Bernama ${user.nama_lengkap} Telah Logout`,
        waktu_aktivitas: new Date(),
        id_user: user.id_user,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Logout Berhasil",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal hapus file" },
      { status: 500 },
    );
  }
}
