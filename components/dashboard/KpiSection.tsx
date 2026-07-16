"use client";

import { useEffect, useState } from "react";
import { DollarSign, FileText, CheckCircle, UserPlus } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

interface KpiData {
    revenue: { value: number; trend: number };
    orders: { value: number; trend: number };
    customers: { total: number; newThisMonth: number };
    products: { active: number; lowStock: number };
}

function formatRupiah(n: number) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function KpiSection() {
    const [data, setData] = useState<KpiData | null>(null);

    useEffect(() => {
        fetch("/api/dashboard/kpi")
            .then(r => r.json())
            .then(setData)
            .catch(() => { });
    }, []);

    const kpis = [
        {
            icon: <DollarSign className="w-6 h-6" />,
            iconColor: "purple" as const,
            label: "Total Omzet",
            value: data ? formatRupiah(data.revenue.value) : "—",
            trend: data ? `${data.revenue.trend > 0 ? "+" : ""}${data.revenue.trend}%` : "bulan ini",
            trendDirection: (data?.revenue.trend ?? 0) >= 0 ? "up" as const : "down" as const,
        },
        {
            icon: <FileText className="w-6 h-6" />,
            iconColor: "blue" as const,
            label: "Total Transaksi",
            value: data ? data.orders.value.toLocaleString("id-ID") : "—",
            trend: data ? `${data.orders.trend > 0 ? "+" : ""}${data.orders.trend}%` : "bulan ini",
            trendDirection: (data?.orders.trend ?? 0) >= 0 ? "up" as const : "down" as const,
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            iconColor: "green" as const,
            label: "Produk Aktif",
            value: data ? data.products.active.toString() : "—",
            trend: data ? `${data.products.lowStock} stok rendah` : "",
            trendDirection: (data?.products.lowStock ?? 0) > 0 ? "down" as const : "up" as const,
        },
        {
            icon: <UserPlus className="w-6 h-6" />,
            iconColor: "orange" as const,
            label: "Total Pelanggan",
            value: data ? data.customers.total.toLocaleString("id-ID") : "—",
            trend: data ? `+${data.customers.newThisMonth} bulan ini` : "",
            trendDirection: "up" as const,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-6">
            {kpis.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
            ))}
        </div>
    );
}
