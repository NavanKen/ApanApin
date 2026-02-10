import { z } from "zod";

export const kendaraanSchema = z.object({
  plat_nomor: z.string().min(1, "Plat Nomor"),
  jenis_kendaraan: z.string().min(1, "Jenis Kendaraan Wajib Diisi"),
  warna: z.string().optional(),
  pemilik: z.string().min(1, "Pemilik Wajib Diisi"),
});
