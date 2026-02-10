import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const AreaParkisService = {
  getAreaParkir: (params) => instance.get(`${endpoint.AREA_PARKIR}?${params}`),
  getAreaParkirById: (id) => instance.get(`${endpoint.AREA_PARKIR}/${id}`),
  createAreaParkir: (data) => instance.post(`${endpoint.AREA_PARKIR}`, data),
  updateAreaParkir: (id, data) =>
    instance.put(`${endpoint.AREA_PARKIR}/${id}`, data),
  deleteAreaParkir: (id) => instance.delete(`${endpoint.AREA_PARKIR}/${id}`),
};

export default AreaParkisService;
