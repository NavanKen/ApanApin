import { z } from "zod";

export const createKategoriSchema = z.object({
  nama_kategori: z
    .string({ required_error: "Nama kategori wajib diisi" })
    .min(1, "Nama kategori wajib diisi")
    .min(2, "Nama kategori minimal 2 karakter"),
  deskripsi: z
    .string({ required_error: "Deskripsi wajib diisi" })
    .min(1, "Deskripsi wajib diisi"),
  image: z.string().optional(),
});

export const updateKategoriSchema = z.object({
  nama_kategori: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .optional(),
  deskripsi: z.string().optional(),
  image: z.string().optional(),
});
