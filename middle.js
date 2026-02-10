import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // PAGES
  //   if (pathname === "/auth/login" || pathname === "/auth/register") {
  //     if (token) {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //     return NextResponse.next();
  //   }

  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/kepala-sekolah")) {
    if (!token || token.role !== "KEPALA_SEKOLAH") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/orang-tua")) {
    if (!token || token.role !== "ORANG_TUA") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/siswa")) {
    if (!token || token.role !== "SISWA") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // API
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }

    if (token.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki akses" },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/pengaduan")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }

    const isDetail = /^\/api\/pengaduan\/[^/]+$/.test(pathname);

    let allowedRoles = [];

    if (request.method === "POST") {
      allowedRoles = ["SISWA", "ORANG_TUA"];
    } else if (request.method === "GET" && isDetail) {
      allowedRoles = ["SISWA", "ORANG_TUA", "ADMIN", "KEPALA_SEKOLAH"];
    } else {
      allowedRoles = ["ADMIN", "KEPALA_SEKOLAH"];
    }

    if (!allowedRoles.includes(token.role)) {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki akses" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/data")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/api/me") {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/api/dashboard") {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }
  }

  if (pathname === "/api/profile") {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/kepala-sekolah/:path*",
    "/orang-tua/:path*",
    "/siswa/:path*",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/pengaduan/:path*",
    "/api/data/:path*",
    "/api/me",
  ],
};

// contoh use login
("use client");

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email / NISN wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrlParam = searchParams.get("callbackUrl");
  const callbackUrl = callbackUrlParam
    ? decodeURIComponent(callbackUrlParam)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (res?.error) {
        toast.error("Email / NISN atau password salah");
        return;
      }

      const session = await getSession();

      if (!session?.user) {
        toast.error("Akun tidak ditemukan");
        return;
      }

      const role = session.user.role;
      toast.success("Login berhasil");
      reset();

      const ROLE_HOME = {
        ADMIN: "/admin",
        KEPALA_SEKOLAH: "/kepala-sekolah",
        SISWA: "/siswa",
        ORANG_TUA: "/orang-tua",
      };

      const isCallbackAllowed = (url, role) => {
        if (!url) return false;
        return url.startsWith(ROLE_HOME[role]);
      };

      if (isCallbackAllowed(callbackUrl, role)) {
        router.replace(callbackUrl);
        return;
      }

      // fallback aman
      router.replace(ROLE_HOME[role] || "/");
    },
    [router, reset, callbackUrl],
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading: isSubmitting,
    showPassword,
    toggleShowPassword: () => setShowPassword((p) => !p),
  };
};

export default useLogin;
