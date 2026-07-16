"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, TrendingUp, BarChart2 } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

interface Stats {
    revenue: number;
    orders: number;
    profit: number;
}

function formatRupiah(n: number) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function SalesStatsRow() {
    const [stats, setStats] = useState<Stats>({ revenue: 0, orders: 0, profit: 0 });

    useEffect(() => {
        fetch("/api/orders")
            .then(r => r.json())
            .then(data => {
                const orders = data.data ?? [];
                const completed = orders.filter((o: { status: string }) => o.status === "COMPLETED");
                const revenue = completed.reduce(
                    (s: number, o: { total: number }) => s + o.total,
                    0
                );
                const orderCount = completed.length;
                setStats({ revenue, orders: orderCount, profit: Math.round(revenue * 0.3) });
            })
            .catch(() => { });
    }, []);

    const cards = [
        {
            icon: <DollarSign className="w-6 h-6" />,
            iconColor: "purple" as const,
            label: "Revenue",
            value: formatRupiah(stats.revenue),
            trend: "bulan ini",
            trendDirection: "up" as const,
            trendSuffix: "",
        },
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            iconColor: "blue" as const,
            label: "Orders",
            value: stats.orders.toString(),
            trend: "selesai",
            trendDirection: "up" as const,
            trendSuffix: "",
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            iconColor: "green" as const,
            label: "Est. Profit",
            value: formatRupiah(stats.profit),
            trend: "~30% margin",
            trendDirection: "up" as const,
            trendSuffix: "",
        },
        {
            icon: <BarChart2 className="w-6 h-6" />,
            iconColor: "orange" as const,
            label: "Avg. Order",
            value:
                stats.orders > 0
                    ? formatRupiah(Math.round(stats.revenue / stats.orders))
                    : "Rp 0",
            trend: "per transaksi",
            trendDirection: "up" as const,
            trendSuffix: "",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {cards.map(stat => (
                <KpiCard key={stat.label} {...stat} />
            ))}
        </div>
    );
}
