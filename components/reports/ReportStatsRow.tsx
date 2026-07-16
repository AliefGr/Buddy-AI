"use client";

import { useEffect, useState } from "react";
import { DollarSign, ArrowDownLeft, TrendingUp, BarChart2 } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

function formatRupiah(n: number) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function ReportStatsRow() {
    const [data, setData] = useState<{ revenue: { value: number; trend: number }; orders: { value: number; trend: number } } | null>(null);

    useEffect(() => {
        fetch("/api/dashboard/kpi").then(r => r.json()).then(setData).catch(() => { });
    }, []);

    const revenue = data?.revenue.value ?? 0;
    const estExpense = Math.round(revenue * 0.35);
    const estProfit = revenue - estExpense;

    const stats = [
        {
            icon: <DollarSign className="w-6 h-6" />,
            iconColor: "purple" as const,
            label: "Revenue",
            value: formatRupiah(revenue),
            trend: data ? `${data.revenue.trend > 0 ? "+" : ""}${data.revenue.trend}%` : "—",
            trendDirection: (data?.revenue.trend ?? 0) >= 0 ? "up" as const : "down" as const,
            trendSuffix: "dari bulan lalu",
        },
        {
            icon: <ArrowDownLeft className="w-6 h-6" />,
            iconColor: "red" as const,
            label: "Est. Pengeluaran",
            value: formatRupiah(estExpense),
            trend: "~35%",
            trendDirection: "up" as const,
            trendSuffix: "dari revenue",
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            iconColor: "green" as const,
            label: "Est. Profit",
            value: formatRupiah(estProfit),
            trend: "~65%",
            trendDirection: "up" as const,
            trendSuffix: "margin",
        },
        {
            icon: <BarChart2 className="w-6 h-6" />,
            iconColor: "blue" as const,
            label: "Total Transaksi",
            value: data ? data.orders.value.toLocaleString("id-ID") : "—",
            trend: data ? `${data.orders.trend > 0 ? "+" : ""}${data.orders.trend}%` : "—",
            trendDirection: (data?.orders.trend ?? 0) >= 0 ? "up" as const : "down" as const,
            trendSuffix: "dari bulan lalu",
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
                <KpiCard key={stat.label} {...stat} />
            ))}
        </div>
    );
}
