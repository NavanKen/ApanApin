"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email / Username Wajib Diisi"),
  password: z.string().min(6, "Password Minimal 6 Karakter"),
});

const roleRedirect = {
  admin: "/admin",
  owner: "/owner",
  petugas: "/petugas",
};

const roleBasePath = {
  admin: "/admin",
  owner: "/owner",
  petugas: "/petugas",
};

const isAllowedCallback = (callbackUrl, role) => {
  if (!callbackUrl) return false;

  const basePath = roleBasePath[role];
  if (!basePath) return false;

  return callbackUrl.startsWith(basePath);
};

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginService = async (payload) => {
    const result = await signIn("credentials", {
      ...payload,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Invalid credentials");
    }

    return result;
  };

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: loginService,
    onSuccess: async () => {
      reset();

      const session = await getSession();

      if (!session?.user) {
        toast.error("Akun tidak ditemukan");
        return;
      }

      const role = session.user.role;

      let redirectTo;

      if (callbackUrl && isAllowedCallback(callbackUrl, role)) {
        redirectTo = callbackUrl;
      } else {
        redirectTo = roleRedirect[role] || "/";
      }

      toast.success("Login Success");
      router.push(redirectTo);
    },
    onError: () => {
      toast.error("Email / Password Salah");
    },
  });

  const onSubmit = (data) => handleLogin(data);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
    showPassword,
    setShowPassword,
  };
};
