import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const transaksiService = {
    getTransaksi: (params) => instance.get(`${endpoint.TRANSAKSI}?${params}`),
    getTransaksiById: (id) => instance.get(`${endpoint.TRANSAKSI}/${id}`),
    createTransaksi: (data) => instance.post(`${endpoint.TRANSAKSI}`, data),
    updateTransaksiKeluar: (id) => instance.put(`${endpoint.TRANSAKSI}/${id}`),
    // Helper: get kendaraan and area lists for the form
    getKendaraanList: (params) =>
        instance.get(`${endpoint.KENDARAAN}?${params || "limit=100"}`),
    getAreaParkirList: (params) =>
        instance.get(`${endpoint.AREA_PARKIR}?${params || "limit=100"}`),
};

export default transaksiService;
