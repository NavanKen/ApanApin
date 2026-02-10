import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const kendaraanService = {
  getKendaraan: (params) => instance.get(`${endpoint.KENDARAAN}?${params}`),
  getKendaraanById: (id) => instance.get(`${endpoint.KENDARAAN}/${id}`),
  createKendaraan: (data) => instance.post(`${endpoint.KENDARAAN}`, data),
  updateKendaraan: (id, data) =>
    instance.put(`${endpoint.KENDARAAN}/${id}`, data),
  deleteKendaraan: (id) => instance.delete(`${endpoint.KENDARAAN}/${id}`),
};

export default kendaraanService;
