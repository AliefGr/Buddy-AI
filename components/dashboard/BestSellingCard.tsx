"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

interface BestSellingItem {
    rank: number;
    productId: string;
    name: string;
    imageUrl: string | null;
    totalSold: number;
    totalRevenue: number;
}

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function BestSellingCard() {
    const [items, setItems] = useState<BestSellingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard/best-selling")
            .then(r => r.json())
            .then(d => { setItems(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <Card className="col-span-1 lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-buddy-text-main">Produk Terlaris</h3>
                <span className="text-xs text-buddy-text-muted bg-gray-50 border border-gray-200 rounded-lg py-1 px-3">All Time</span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-buddy-text-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Memuat...</span>
                </div>
            ) : items.length === 0 ? (
                <p className="text-sm text-buddy-text-muted text-center py-8">Belum ada data penjualan</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-50">
                            <th className="pb-3 w-10">No</th>
                            <th className="pb-3">Produk</th>
                            <th className="pb-3 text-right">Terjual</th>
                            <th className="pb-3 text-right">Omzet</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map((p) => (
                            <tr key={p.productId} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 font-medium text-gray-400">{p.rank}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-buddy-purple/10 flex items-center justify-center text-buddy-purple font-bold text-xs shrink-0 overflow-hidden">
                                            {p.imageUrl
                                                ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                : p.name.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-gray-800">{p.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 text-right font-bold text-buddy-text-main">{p.totalSold} terjual</td>
                                <td className="py-3 text-right font-bold text-buddy-text-main">{formatRupiah(p.totalRevenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Card>
    );
}
