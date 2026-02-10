import UserController from "@/controllers/user.controller";

export async function GET(req, { params }) {
  const { id } = await params;
  return UserController.findOne({ id: Number(id) });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  return await UserController.update(body, id);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return await UserController.remove({ id: Number(id) });
}
