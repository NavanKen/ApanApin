import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const AuthService = {
  signOutActivity: () => instance.post(`${endpoint.AUTH}/logout`),
  getAuthAktivity: (params) => instance.get(`${endpoint.AKTIVITAS}?${params}`),
};

export default AuthService;
