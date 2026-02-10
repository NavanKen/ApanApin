import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const AuthService = {
  signOutActivity: () => instance.post(`${endpoint.AUTH}/logout`),
  getAuthAktivity: (params) => instance.get(`${endpoint.AKTIVITAS}?${params}`),
  getUserInfo: () => instance.get(`/me`),
};

export default AuthService;
