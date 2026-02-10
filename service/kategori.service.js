import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const kategoriServices = {
  getKategori: (params) => instance.get(`${endpoint.KATEGORI}?${params}`),
  getKategoriById: (id) => instance.get(`${endpoint.KATEGORI}/${id}`),
  createKategori: (data) => instance.post(`${endpoint.KATEGORI}`, data),
  updateKategori: (id, data) =>
    instance.put(`${endpoint.KATEGORI}/${id}`, data),
  deleteKategori: (id) => instance.delete(`${endpoint.KATEGORI}/${id}`),
};

export default kategoriServices;
