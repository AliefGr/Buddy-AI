"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, Loader2 } from "lucide-react";

interface TopProduct {
    rank: number;
    productId: string;
    name: string;
    totalSold: number;
    totalRevenue: number;
}

const barColors = ["bg-buddy-purple", "bg-blue-500", "bg-green-500", "bg-amber-500", "bg-orange-500"];

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function AnalyticsTopProducts() {
    const [products, setProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard/best-selling")
            .then(r => r.json())
            .then(d => { setProducts(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const maxRevenue = Math.max(...products.map(p => p.totalRevenue), 1);

    return (
        <Card className="col-span-1 lg:col-span-4">
            <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-buddy-purple" />
                <h3 className="font-bold text-buddy-text-main">Top Produk</h3>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-buddy-text-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Memuat...</span>
                </div>
            ) : products.length === 0 ? (
                <p className="text-sm text-buddy-text-muted text-center py-8">Belum ada data penjualan</p>
            ) : (
                <div className="space-y-4">
                    {products.map((p, idx) => (
                        <div key={p.productId}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-buddy-text-subtle w-4">{p.rank}</span>
                                    <span className="text-xs font-semibold text-buddy-text-main truncate max-w-32">
                                        {p.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-bold text-buddy-text-main">{formatRupiah(p.totalRevenue)}</span>
                                    <span className="text-[10px] text-buddy-text-subtle">{p.totalSold} terjual</span>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${barColors[idx] ?? "bg-gray-400"} transition-all duration-700`}
                                    style={{ width: `${(p.totalRevenue / maxRevenue) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
