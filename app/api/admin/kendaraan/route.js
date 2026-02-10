import KendaraanController from "@/controllers/kendaraan.controller";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search");
  return await KendaraanController.findAll({ page, limit, search });
}

export async function POST(req) {
  const body = await req.json();

  return await KendaraanController.create(body);
}
