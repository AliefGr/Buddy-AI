"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-buddy-bg">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Sidebar (drawer) */}
            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Main content — offset on desktop, full width on mobile */}
            <main className="flex-1 lg:ml-64 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
                    <DashboardHeader onMenuOpen={() => setMobileOpen(true)} />
                    {children}
                </div>
            </main>
        </div>
    );
}
