import { z } from "zod";

export const transaksiSchema = z.object({
    id_kendaraan: z.number({ required_error: "Kendaraan Wajib Dipilih" }),
    id_area: z.number({ required_error: "Area Parkir Wajib Dipilih" }),
});
