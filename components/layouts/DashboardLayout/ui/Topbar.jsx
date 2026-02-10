"use client";

import { User, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import useMe from "../useMe";

const TopBar = ({ title = "Dashboard", subtitle = "", onMenuClick, role }) => {
  //   const { getDisplayName } = useMe();

  //   const getRoleLabel = (role) => {
  //     switch (role) {
  //       case "admin":
  //         return "Admin";
  //       case "siswa":
  //         return "Siswa";
  //       case "orang_tua":
  //         return "Orang Tua";
  //       case "kepala_sekolah":
  //         return "Kepala Sekolah";
  //       default:
  //         return "User";
  //     }
  //   };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex flex-col">
          <h1 className="font-bold text-base lg:text-lg text-gray-800">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex-col items-end hidden sm:flex">
            <span className="font-medium text-sm text-gray-700">
              {"APAN APIN"}
            </span>
            <span className="text-xs text-gray-400">{"ADMIN"}</span>
          </div>
          <Avatar className="w-9 h-9 border-2 border-gray-100">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-linear-to-br from-[#1e6091] to-[#1a5276] text-white text-sm">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
