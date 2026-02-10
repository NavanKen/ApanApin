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
  // {
  //   key: "riwayat",
  //   label: "Riwayat Pengaduan",
  //   description: "Lihat status pengaduan",
  //   href: "/siswa/riwayat",
  //   icon: MessagesSquare,
  // },
];

export const SIDEBAR_OWNER = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Ringkasan sistem",
    href: "/orang-tua",
    icon: LayoutDashboard,
  },
  {
    key: "kritik-saran",
    label: "Kritik & Saran",
    description: "Kirim masukan",
    href: "/orang-tua/kritik-saran",
    icon: MessageSquareText,
  },
  {
    key: "pengaturan",
    label: "Pengaturan Akun",
    description: "Konfigurasi Akun",
    href: "/orang-tua/pengaturan",
    icon: Settings,
  },
];

export const SIDEBAR_PETUGAS = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Ringkasan sistem",
    href: "/kepala-sekolah",
    icon: LayoutDashboard,
  },
];
