import { z } from "zod";

export const tarifParkirSchema = z.object({
  jenis_kendaraan: z.string().min(1, "Jenis Kendaraan Wajib Diisi"),
  tarif_per_jam: z.string().min(1, "Tarif Per Jam Wajib Diisi"),
});

export const tarifPerjam = z.object({
  tarif_per_jam: z.any(),
});
