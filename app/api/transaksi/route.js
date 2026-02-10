import TransaksiController from "@/controllers/transaksi.controller";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "desc";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    return await TransaksiController.findAll({
        page,
        limit,
        search,
        sort,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    });
}

export async function POST(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token) {
        return Response.json(
            { success: false, error: "Silakan login terlebih dahulu" },
            { status: 401 },
        );
    }

    const body = await req.json();

    return await TransaksiController.create({
        ...body,
        id_user: token.id,
    });
}
