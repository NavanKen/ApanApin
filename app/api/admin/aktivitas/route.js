import AktivitasController from "@/controllers/aktivitas.controller";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search");
  return await AktivitasController.findAll({ page, limit, search });
}
