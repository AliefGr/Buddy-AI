"use client";

import {
    User,
    Building2,
    Bell,
    Shield,
    CreditCard,
    Link2,
    ChevronRight,
} from "lucide-react";

export type SettingsTab = "profil" | "bisnis" | "integrasi" | "notifikasi" | "keamanan" | "langganan";

const navItems: Array<{
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
    description: string;
}> = [
        {
            id: "profil",
            label: "Profil",
            icon: <User className="w-4 h-4" />,
            description: "Foto & info personal",
        },
        {
            id: "bisnis",
            label: "Bisnis",
            icon: <Building2 className="w-4 h-4" />,
            description: "Info toko & bisnis",
        },
        {
            id: "integrasi",
            label: "Integrasi",
            icon: <Link2 className="w-4 h-4" />,
            description: "WA, email, Instagram",
        },
        {
            id: "notifikasi",
            label: "Notifikasi",
            icon: <Bell className="w-4 h-4" />,
            description: "Preferensi notifikasi",
        },
        {
            id: "keamanan",
            label: "Keamanan",
            icon: <Shield className="w-4 h-4" />,
            description: "Password & 2FA",
        },
        {
            id: "langganan",
            label: "Langganan",
            icon: <CreditCard className="w-4 h-4" />,
            description: "Plan & billing",
        },
    ];

interface SettingsNavProps {
    active: SettingsTab;
    onChange: (tab: SettingsTab) => void;
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</p>
            </div>
            <nav className="p-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all mb-1 group ${active === item.id
                                ? "bg-buddy-purple/10 text-buddy-purple"
                                : "text-buddy-text-muted hover:bg-gray-50 hover:text-buddy-text-main"
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active === item.id ? "bg-buddy-purple/20" : "bg-gray-100 group-hover:bg-gray-200"
                                }`}
                        >
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${active === item.id ? "text-buddy-purple" : ""}`}>
                                {item.label}
                            </p>
                            <p className="text-[10px] text-buddy-text-subtle">{item.description}</p>
                        </div>
                        {active === item.id && (
                            <ChevronRight className="w-4 h-4 text-buddy-purple shrink-0" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
