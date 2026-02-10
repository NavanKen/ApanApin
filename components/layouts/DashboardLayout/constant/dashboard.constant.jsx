import {
  LayoutDashboard,
  MessageSquareText,
  MessagesSquare,
  Users,
  User,
  GraduationCap,
  BookOpen,
  School,
  Shield,
  ClipboardList,
  Settings,
  ParkingSquare,
  CarFront,
  Tag,
  Activity,
  Receipt,
} from "lucide-react";

export const SIDEBAR_ADMIN = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Ringkasan sistem",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    key: "User",
    label: "User",
    description: "Manajamen user",
    href: "/admin/user",
    icon: User,
  },
  {
    key: "Area Parkir",
    label: "Buat Area Parkir",
    description: "Manajamen Area Parkir",
    href: "/admin/area-parkir",
    icon: ParkingSquare,
  },
  {
    key: "Tarif Parkir",
    label: "Tarif Parkir",
    description: "Manajamen Tarif Parkir",
    href: "/admin/tarif",
    icon: Tag,
  },
  {
    key: "Kendaraan",
    label: "Kendaraan",
    description: "Manajamen Kendaraan",
    href: "/admin/kendaraan",
    icon: CarFront,
  },

  {
    key: "Log Aktifitas",
    label: "Log Aktifitas",
    description: "Aktivitas User",
    href: "/admin/aktifitas",
    icon: Activity,
  },
];

export const SIDEBAR_OWNER = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Ringkasan sistem",
    href: "/owner",
    icon: LayoutDashboard,
  },
  {
    key: "rekap-transaksi",
    label: "Rekap Transaksi",
    description: "Lihat rekap transaksi",
    href: "/owner/rekap-transaksi",
    icon: ClipboardList,
  },
];

export const SIDEBAR_PETUGAS = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Ringkasan sistem",
    href: "/petugas",
    icon: LayoutDashboard,
  },
  {
    key: "transaksi",
    label: "Transaksi",
    description: "Kelola transaksi parkir",
    href: "/petugas/transaksi",
    icon: Receipt,
  },
];
