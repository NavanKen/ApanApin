"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import AuthService from "@/service/auth.service";

const Sidebar = ({ sidebarItems = [], isOpen, onClose, role }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await AuthService.signOutActivity();
    await signOut({ redirect: false });
    router.push("/login");
  };



  const isActive = (href) => {
    if (
      href === "/admin" ||
      href === "/petugas" ||
      href === "/owner"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 px-4 flex items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-[#1e6091] to-[#1a5276] text-white ">
              <Car className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-base tracking-tight">
                PARKIR
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                      active
                        ? "bg-linear-to-r from-[#1e6091] to-[#2980b9] text-white shadow-lg shadow-[#1e6091]/25"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
                        active
                          ? "bg-white/20"
                          : "bg-gray-100 group-hover:bg-gray-200",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          active ? "text-white" : "text-gray-500",
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          active ? "text-white" : "text-gray-700",
                        )}
                      >
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          active ? "text-white/80" : "text-gray-400",
                        )}
                      >
                        {item.description}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari sistem? Anda perlu login
              kembali untuk mengakses aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
