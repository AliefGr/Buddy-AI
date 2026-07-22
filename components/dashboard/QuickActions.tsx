"use client";

import { PlusCircle, FilePlus, Send, ShoppingCart } from "lucide-react";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { useRouter } from "next/navigation";

export function QuickActions() {
    const router = useRouter();

    const actions = [
        {
            icon: <PlusCircle className="w-5 h-5" />,
            label: "Tambah Produk",
            iconColor: "purple" as const,
            onClick: () => router.push("/dashboard/products"),
        },
        {
            icon: <ShoppingCart className="w-5 h-5" />,
            label: "Buat Order",
            iconColor: "blue" as const,
            onClick: () => router.push("/dashboard/sales"),
        },
        {
            icon: <Send className="w-5 h-5" />,
            label: "Buat Broadcast",
            iconColor: "green" as const,
            onClick: () => router.push("/dashboard/broadcast"),
        },
        {
            icon: <FilePlus className="w-5 h-5" />,
            label: "Lihat Laporan",
            iconColor: "amber" as const,
            onClick: () => router.push("/dashboard/reports"),
        },
    ];

    return (
        <footer className="mt-8">
            <h3 className="font-bold text-buddy-text-main mb-4">Aksi Cepat</h3>
            <div className="flex gap-4 flex-wrap">
                {actions.map((action) => (
                    <QuickActionButton key={action.label} {...action} />
                ))}
            </div>
        </footer>
    );
}
