import DashboardLayout from "@/components/layouts/DashboardLayout/DashboardLayout";

export default function PetugasLayout({ children }) {
  return (
    <>
      <DashboardLayout role="petugas">{children}</DashboardLayout>
    </>
  );
}
