import KategoriController from "@/controllers/kategori.controller";

export async function GET(req, { params }) {
  const { id } = await params;
  return KategoriController.findOne({ id: Number(id) });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  return await KategoriController.update(body, id);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return await KategoriController.remove({ id: Number(id) });
}
