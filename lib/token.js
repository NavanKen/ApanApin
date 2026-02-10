import { getToken } from "next-auth/jwt";
import environment from "@/config/environment";

export const GetToken = async (req) => {
  const token = await getToken({
    req,
    secret: environment.AUTH_SECRET,
  });

  return token;
};
