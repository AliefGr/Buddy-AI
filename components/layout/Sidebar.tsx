"use client";

import {
    LayoutDashboard,
    MessageSquare,
    Sparkles,
    Calendar,
    Package,
    Database,
    ShoppingCart,
    Users,
    Megaphone,
    Target,
    Send,
    Crown,
    Zap,
    BarChart2,
    FileText,
    Settings,
    X,
    LogOut,
} from "lucide-react";
import { NavItem } from "@/components/ui/NavItem";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const navSections = [
    {
        label: null,
        items: [
            { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
        ],
    },
    {
        label: "AI Copilot",
        items: [
            { href: "/dashboard/ai-assistant", icon: <MessageSquare className="w-5 h-5" />, label: "AI Assistant" },
            { href: "/dashboard/analytics", icon: <Sparkles className="w-5 h-5" />, label: "AI Insight" },
            { href: "/dashboard/daily-brief", icon: <Calendar className="w-5 h-5" />, label: "Daily Brief" },
        ],
    },
    {
        label: "Business",
        items: [
            { href: "/dashboard/products", icon: <Package className="w-5 h-5" />, label: "Produk" },
            { href: "/dashboard/inventory", icon: <Database className="w-5 h-5" />, label: "Inventory" },
            { href: "/dashboard/sales", icon: <ShoppingCart className="w-5 h-5" />, label: "Penjualan" },
            { href: "/dashboard/customers", icon: <Users className="w-5 h-5" />, label: "Pelanggan" },
        ],
    },
    {
        label: "Marketing",
        items: [
            { href: "/dashboard/marketing", icon: <Megaphone className="w-5 h-5" />, label: "Marketing AI" },
            { href: "/dashboard/campaign", icon: <Target className="w-5 h-5" />, label: "Campaign" },
            { href: "/dashboard/broadcast", icon: <Send className="w-5 h-5" />, label: "Broadcast" },
        ],
    },
    {
        label: "Laporan & Analisis",
        items: [
            { href: "/dashboard/analytics", icon: <BarChart2 className="w-5 h-5" />, label: "Analytics" },
            { href: "/dashboard/reports", icon: <FileText className="w-5 h-5" />, label: "Laporan" },
        ],
    },
    {
        label: "Akun",
        items: [
            { href: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, label: "Pengaturan" },
        ],
    },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const [user, setUser] = useState<{ name: string; email: string; store?: { name: string } | null } | null>(null);

    useEffect(() => {
        fetch("/api/user/profile").then(r => r.json()).then(setUser).catch(() => { });
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-buddy-purple rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-buddy-text-main">Buddy</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center lg:hidden"
                        aria-label="Tutup menu"
                    >
                        <X className="w-4 h-4 text-buddy-text-muted" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-5 text-sm pb-4">
                {navSections.map((section, idx) => (
                    <div key={idx}>
                        {section.label && (
                            <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                {section.label}
                            </h3>
                        )}
                        <ul className="space-y-0.5">
                            {section.items.map((item) => (
                                <NavItem
                                    key={item.label}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    onNavigate={onClose}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                {/* Upgrade Card */}
                <div className="bg-buddy-purple/5 p-4 rounded-3xl mb-4 text-center">
                    <Crown className="w-6 h-6 text-buddy-purple mx-auto mb-2" />
                    <p className="text-xs font-bold text-buddy-text-main mb-1">Upgrade ke Pro</p>
                    <p className="text-[10px] text-gray-500 mb-3 leading-tight">
                        Dapatkan fitur lengkap dan analisis AI yang lebih akurat.
                    </p>
                    <Button variant="primary" size="sm" className="w-full justify-center rounded-xl">
                        Upgrade Sekarang
                    </Button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-buddy-purple/10 shrink-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-buddy-purple">
                            {user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() ?? "?"}
                        </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-buddy-text-main">{user?.name ?? "Loading..."}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{user?.store?.name ?? "Toko"}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center transition-colors group"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Desktop sidebar — always visible on lg+
export function Sidebar() {
    return (
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col fixed h-full z-50">
            <SidebarContent />
        </aside>
    );
}

// Mobile sidebar — overlay drawer
interface MobileSidebarProps {
    open: boolean;
    onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent onClose={onClose} />
            </aside>
        </>
    );
}
