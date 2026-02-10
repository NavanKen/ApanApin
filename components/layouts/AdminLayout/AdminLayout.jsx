import DashboardLayout from "@/components/layouts/DashboardLayout/DashboardLayout";

export default function AdminLayout({ children }) {
  return (
    <>
      <DashboardLayout role="admin">{children}</DashboardLayout>
    </>
  );
}
