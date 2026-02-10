import KendaraanController from "@/controllers/kendaraan.controller";

export async function GET(req, { params }) {
  const { id } = await params;
  return KendaraanController.findOne({ id: Number(id) });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  return await KendaraanController.update(body, id);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return await KendaraanController.remove({ id: Number(id) });
}
