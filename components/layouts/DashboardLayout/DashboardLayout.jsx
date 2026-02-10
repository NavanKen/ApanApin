"use client";

import { useState } from "react";
import TopBar from "./ui/Topbar";
import Sidebar from "./ui/Sidebar";
import {
  SIDEBAR_ADMIN,
  SIDEBAR_OWNER,
  SIDEBAR_PETUGAS,
} from "./constant/dashboard.constant";

const DashboardLayout = ({
  children,
  role = "admin",
  title = "Dashboard",
  subtitle = "",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getSidebarItems = (role) => {
    switch (role) {
      case "admin":
        return SIDEBAR_ADMIN;
      case "petugas":
        return SIDEBAR_PETUGAS;
      case "owner":
        return SIDEBAR_OWNER;
    }
  };

  const sidebarItems = getSidebarItems(role);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarItems={sidebarItems}
        role={role}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <TopBar
          title={title}
          subtitle={subtitle}
          role={role}
          onMenuClick={handleMenuClick}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
