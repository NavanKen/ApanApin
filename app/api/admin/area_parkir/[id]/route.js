import AreaParkirController from "@/controllers/area_parkir.controller";

export async function GET(req, { params }) {
  const { id } = await params;
  return AreaParkirController.findOne({ id: Number(id) });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  return await AreaParkirController.update(body, id);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return await AreaParkirController.remove({ id: Number(id) });
}
