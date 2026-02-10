"use client";

import React from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogin } from "./useLogin";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
    showPassword,
    setShowPassword,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden ">
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14  bg-linear-to-r from-[#1e6091] to-[#2980b9] hover:from-[#1a5276] hover:to-[#1e6091]/90 rounded-xl flex items-center justify-center shadow-lg ">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-black text-[2.5rem] font-bold text-center mb-3 tracking-tight">
          Parkir
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Tidak punya akun?{" "}
          <Link
            href="/register"
            className="text-black underline underline-offset-4 hover:no-underline transition-all"
          >
            Register
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-black text-sm font-medium block mb-2.5">
              Email / Username
            </label>
            <Input
              {...register("identifier")}
              placeholder="m@example.com"
              className={`h-12 bg-transparent text-black placeholder:text-zinc-500
                ${
                  errors.identifier
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-zinc-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600"
                }
              `}
            />
            {errors.identifier && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-black text-sm font-medium block mb-2.5">
              Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Masukkan password"
                className={`h-12 bg-transparent text-black placeholder:text-zinc-500 pr-12
            ${
              errors?.password
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-zinc-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600"
            }
          `}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors?.password && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-linear-to-r from-[#1e6091] to-[#2980b9] hover:from-[#1a5276] hover:to-[#1e6091]/90 text-white font-semibold
              transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-60"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
