const parsed = userSchema.safeParse(body);

if (!parsed.success) {
  return NextResponse.json(
    { errors: parsed.error.flatten().fieldErrors },
    { status: 400 },
  );
}

export const registerSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password wajib"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi tidak sama",
    path: ["confirmPassword"],
  });
