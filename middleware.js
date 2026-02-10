import { NextResponse } from "next/server";
import { GetToken } from "./lib/token";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = await GetToken(request);

  // PAGES
  //   if (pathname === "/auth/login" || pathname === "/auth/register") {
  //     if (token) {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //     return NextResponse.next();
  //   }

  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/owner")) {
    if (!token || token.role !== "owner") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/petugas")) {
    if (!token || token.role !== "petugas") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // if (pathname.startsWith("/api/admin")) {
  //   if (!token) {
  //     return NextResponse.json(
  //       { success: false, error: "Silakan login terlebih dahulu" },
  //       { status: 401 },
  //     );
  //   }

  //   if (token.role !== "admin" && token.role !== "owner") {
  //     return NextResponse.json(
  //       { success: false, error: "Anda tidak memiliki akses" },
  //       { status: 403 },
  //     );
  //   }
  //   return NextResponse.next();
  // }

  if (pathname.startsWith("/api/transaksi")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu" },
        { status: 401 },
      );
    }

    if (token.role !== "petugas" && token.role !== "owner") {
      return NextResponse.json(
        { success: false, error: "Anda tidak memiliki akses" },
        { status: 403 },
      );
    }

    // Owner only allowed GET
    if (token.role === "owner" && request.method !== "GET") {
      return NextResponse.json(
        { success: false, error: "Owner hanya dapat melihat data" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/transaksi/:path*",
    "/petugas/:path*",
    "/owner/:path*",
  ],
};
