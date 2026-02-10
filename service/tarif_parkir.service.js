import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const tarifParkirService = {
  getTarifParkir: (params) =>
    instance.get(`${endpoint.TARIF_PARKIR}?${params}`),
  getTarifParkirById: (id) => instance.get(`${endpoint.TARIF_PARKIR}/${id}`),
  createTarifParkir: (data) => instance.post(`${endpoint.TARIF_PARKIR}`, data),
  updateTarifParkir: (id, data) =>
    instance.put(`${endpoint.TARIF_PARKIR}/${id}`, data),
  deleteTarifParkir: (id) => instance.delete(`${endpoint.TARIF_PARKIR}/${id}`),
};

export default tarifParkirService;
