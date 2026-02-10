import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username Wajib Diisi"),
  password: z.string().min(1, "Password Wajib Diisi"),
});

export const userSchema = z
  .object({
    nama_lengkap: z.string().min(6, "Nama Lengkap Wajib Diisi"),
    username: z.string().min(1, "Username Wajib Diisi"),
    password: z.string().min(6, "Password Minimal 6 Karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi Password Minimal 6 Karakter"),
    role: z.string().min(1, "Role Wajib Diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak Sesuai",
    path: ["confirmPassword"],
  });

export const userSchemaEdit = z.object({
  nama_lengkap: z.string().min(6, "Nama Lengkap Wajib Diisi"),
  username: z.string().min(1, "Username Wajib Diisi"),
  role: z.string().min(1, "Role Wajib Diisi"),
});
