import { prisma } from "@/lib/prisma/prisma";
import response from "@/lib/response";
import { getToken } from "next-auth/jwt";

export async function GET(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    const tokenId = Number(token.id);

    const user = await prisma.tb_user.findUnique({
      where: { id_user: tokenId },
      select: {
        id_user: true,
        nama_lengkap: true,
        role: true,
      },
    });
    if (!user) {
      return response.notFound("User tidak ditemukan");
    }

    return response.success(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return response.serverError;
  }
}
