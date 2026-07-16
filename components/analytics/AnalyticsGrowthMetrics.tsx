"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { Users, ShoppingBag, Repeat, TrendingUp, Loader2 } from "lucide-react";

interface KpiData {
    revenue: { value: number; trend: number };
    orders: { value: number; trend: number };
    customers: { total: number; newThisMonth: number };
    products: { active: number; lowStock: number };
}

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function AnalyticsGrowthMetrics() {
    const [data, setData] = useState<KpiData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard/kpi")
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Card className="col-span-1 lg:col-span-4">
                <h3 className="font-bold text-buddy-text-main mb-5">Metrik Pertumbuhan</h3>
                <div className="flex items-center justify-center py-8 gap-2 text-buddy-text-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Memuat...</span>
                </div>
            </Card>
        );
    }

    const avgOrder = data && data.orders.value > 0
        ? Math.round(data.revenue.value / data.orders.value)
        : 0;

    const metrics = [
        {
            icon: <Users className="w-4 h-4" />,
            label: "Pelanggan Baru",
            value: data ? data.customers.newThisMonth.toString() : "—",
            trend: data ? `${data.customers.newThisMonth}` : "0",
            direction: "up" as const,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            icon: <ShoppingBag className="w-4 h-4" />,
            label: "Avg Order Value",
            value: data ? formatRupiah(avgOrder) : "—",
            trend: data ? `${data.orders.trend > 0 ? "+" : ""}${data.orders.trend}%` : "0%",
            direction: (data?.orders.trend ?? 0) >= 0 ? "up" as const : "down" as const,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            icon: <TrendingUp className="w-4 h-4" />,
            label: "Revenue Trend",
            value: data ? `${data.revenue.trend > 0 ? "+" : ""}${data.revenue.trend}%` : "—",
            trend: `${data?.revenue.trend ?? 0}%`,
            direction: (data?.revenue.trend ?? 0) >= 0 ? "up" as const : "down" as const,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            icon: <Repeat className="w-4 h-4" />,
            label: "Produk Aktif",
            value: data ? data.products.active.toString() : "—",
            trend: data ? `${data.products.lowStock} stok rendah` : "",
            direction: (data?.products.lowStock ?? 0) > 0 ? "down" as const : "up" as const,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <Card className="col-span-1 lg:col-span-4">
            <h3 className="font-bold text-buddy-text-main mb-5">Metrik Pertumbuhan</h3>
            <div className="space-y-3">
                {metrics.map((m) => (
                    <div key={m.label} className={`${m.bg} rounded-2xl p-4 flex items-center gap-4`}>
                        <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm ${m.color}`}>
                            {m.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{m.label}</p>
                            <p className="font-bold text-buddy-text-main text-sm">{m.value}</p>
                        </div>
                        <TrendBadge value={m.trend} direction={m.direction} />
                    </div>
                ))}
            </div>
        </Card>
    );
}
