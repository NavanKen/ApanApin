import AuthController from "@/controllers/auth.controller";

export async function POST(req) {
  const body = await req.json();

  return await AuthController.create(body);
}
