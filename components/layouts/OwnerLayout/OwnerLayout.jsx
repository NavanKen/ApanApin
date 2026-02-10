import DashboardLayout from "@/components/layouts/DashboardLayout/DashboardLayout";

export default function OwnerLayout({ children }) {
    return (
        <>
            <DashboardLayout role="owner">{children}</DashboardLayout>
        </>
    );
}
