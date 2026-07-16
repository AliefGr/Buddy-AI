"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Archive, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface RecentOrder {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    customer: { name: string } | null;
    items: { quantity: number }[];
}

interface LowStockItem {
    id: string;
    product: { name: string };
    currentStock: number;
    status: string;
}

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m yang lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}j yang lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function RecentActivityCard() {
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/dashboard/recent-orders").then(r => r.json()),
            fetch("/api/inventory").then(r => r.json()),
        ]).then(([recentOrders, inv]) => {
            setOrders(recentOrders.slice(0, 3));
            const low = (inv as LowStockItem[]).filter(i => i.status === "LOW" || i.status === "EMPTY").slice(0, 2);
            setLowStock(low);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    type ColorType = "blue" | "orange";
    interface Activity {
        icon: React.ReactNode;
        iconColor: ColorType;
        label: string;
        time: string;
    }

    const activities: Activity[] = [
        ...orders.map(o => ({
            icon: <ShoppingBag className="w-4 h-4" />,
            iconColor: "blue" as ColorType,
            label: `Order ${o.orderNumber} dari ${o.customer?.name ?? "Walk-in"} — ${formatRupiah(o.total)}`,
            time: timeAgo(o.createdAt),
        })),
        ...lowStock.map(item => ({
            icon: <Archive className="w-4 h-4" />,
            iconColor: "orange" as ColorType,
            label: `Stok ${item.product.name} ${item.status === "EMPTY" ? "habis" : "hampir habis"} (${item.currentStock} tersisa)`,
            time: "Sekarang",
        })),
    ];

    const colorMap: Record<ColorType, string> = {
        blue: "bg-blue-50 text-blue-600",
        orange: "bg-amber-50 text-amber-600",
    };

    return (
        <Card className="col-span-1 lg:col-span-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-buddy-text-main">Aktivitas Terbaru</h3>
                <Link href="/dashboard/sales" className="text-buddy-purple text-xs font-bold hover:underline">
                    Lihat semua
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-buddy-text-muted">
                    <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Memuat...</span>
                </div>
            ) : activities.length === 0 ? (
                <p className="text-sm text-buddy-text-muted text-center py-8">Belum ada aktivitas</p>
            ) : (
                <ul className="space-y-4">
                    {activities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorMap[item.iconColor]}`}>
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-buddy-text-main leading-snug truncate">{item.label}</p>
                                <p className="text-[10px] text-buddy-text-subtle mt-0.5">{item.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
