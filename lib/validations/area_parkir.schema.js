import { z } from "zod";

export const areaParkirSchema = z.object({
  nama_area: z.string().min(1, "Nama Lengkap Wajib Diisi"),
  kapasitas: z.any(),
  terisi: z.any().optional(),
});
