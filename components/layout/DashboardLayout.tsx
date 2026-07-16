import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="ml-64 flex-1 p-8 min-h-screen bg-buddy-bg">{children}</main>
        </div>
    );
}
