"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardHeaderProps {
    onMenuOpen?: () => void;
}

export function DashboardHeader({ onMenuOpen }: DashboardHeaderProps) {
    return (
        <header className="flex justify-between items-center mb-6 lg:mb-8">
            {/* Left: hamburger (mobile) + greeting */}
            <div className="flex items-center gap-3">
                {/* Hamburger — only on mobile */}
                <button
                    onClick={onMenuOpen}
                    className="lg:hidden w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shrink-0"
                    aria-label="Buka menu"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>

                <div>
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-900 leading-tight">
                        Selamat pagi, Budi 👋
                    </h1>
                    <p className="text-gray-500 text-xs lg:text-sm hidden sm:block">
                        Berikut ringkasan bisnis Anda hari ini.
                    </p>
                </div>
            </div>

            {/* Right: search (hidden on mobile) + actions */}
            <div className="flex items-center gap-2 lg:gap-4">
                {/* Search — hidden on small screens */}
                <div className="relative hidden md:block w-56 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari apa saja..."
                        className="w-full pl-10 pr-16 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-buddy-purple/20 focus:border-buddy-purple text-sm outline-none transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 border border-gray-200 font-mono hidden lg:block">
                        Ctrl K
                    </span>
                </div>

                {/* Notification */}
                <Button variant="icon" size="sm" className="p-2" aria-label="Notifikasi">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </Button>

                {/* Help — hidden on mobile */}
                <Button
                    variant="icon"
                    size="sm"
                    className="p-2 hidden sm:flex"
                    aria-label="Bantuan"
                >
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                </Button>

                {/* Avatar */}
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full" aria-label="Profil pengguna" />
            </div>
        </header>
    );
}
