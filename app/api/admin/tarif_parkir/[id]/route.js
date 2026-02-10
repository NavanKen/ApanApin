import TarifParkirController from "@/controllers/tarif_parkir.controller";

export async function GET(req, { params }) {
  const { id } = await params;
  return TarifParkirController.findOne({ id: Number(id) });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  return await TarifParkirController.update(body, id);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return await TarifParkirController.remove({ id: Number(id) });
}
