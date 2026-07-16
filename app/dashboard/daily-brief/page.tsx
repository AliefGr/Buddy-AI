"use client";

import { useState, useEffect } from "react";
import { Calendar, Sparkles, Package, Users, ShoppingCart, TrendingUp, TrendingDown, Zap, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface TodayData {
    revenue: number;
    revenueTrend: number;
    orders: number;
    itemsSold: number;
}

interface InventoryItem {
    id: string;
    currentStock: number;
    minStock: number;
    status: string;
    product: { name: string };
}

interface AgendaItem {
    id: string;
    time: string;
    title: string;
    tag: string | null;
}

const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
});

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

const tagColors: Record<string, string> = {
    Inventory: "bg-amber-100 text-amber-700",
    Produk: "bg-buddy-purple/10 text-buddy-purple",
    Marketing: "bg-green-100 text-green-700",
    Laporan: "bg-blue-100 text-blue-700",
};

export default function DailyBriefPage() {
    const [todayData, setTodayData] = useState<TodayData | null>(null);
    const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [aiBrief, setAiBrief] = useState("");
    const [briefLoading, setBriefLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/dashboard/today").then(r => r.json()),
            fetch("/api/inventory").then(r => r.json()),
        ]).then(([today, inv]) => {
            setTodayData(today);
            setLowStock(
                (inv as InventoryItem[]).filter(i => i.status === "LOW" || i.status === "EMPTY").slice(0, 3)
            );
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    async function generateBrief() {
        setBriefLoading(true);
        try {
            const res = await fetch("/api/ai/daily-brief", { method: "POST" });
            const data = await res.json();
            if (res.ok) setAiBrief(data.brief);
        } finally {
            setBriefLoading(false);
        }
    }

    const highlights = [
        ...(todayData ? [{
            icon: todayData.revenueTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
            color: todayData.revenueTrend >= 0 ? "text-green-600" : "text-red-500",
            bg: todayData.revenueTrend >= 0 ? "bg-green-50" : "bg-red-50",
            title: `Revenue hari ini: ${formatRupiah(todayData.revenue)}`,
            desc: `${Math.abs(todayData.revenueTrend)}% ${todayData.revenueTrend >= 0 ? "naik" : "turun"} dari kemarin`,
        }, {
            icon: <ShoppingCart className="w-4 h-4" />,
            color: "text-buddy-purple",
            bg: "bg-buddy-purple/5",
            title: `${todayData.orders} transaksi hari ini`,
            desc: `${todayData.itemsSold} item terjual`,
        }] : []),
        ...lowStock.map(item => ({
            icon: <Package className="w-4 h-4" />,
            color: "text-amber-600",
            bg: "bg-amber-50",
            title: `Stok ${item.product.name} ${item.status === "EMPTY" ? "habis" : "hampir habis"}`,
            desc: `Tersisa ${item.currentStock} unit, minimum ${item.minStock}`,
        })),
    ];

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-buddy-text-main">Daily Brief</h1>
                <p className="text-sm text-buddy-text-muted">{today}</p>
            </div>

            <div className="mb-6 bg-gradient-to-r from-buddy-purple to-buddy-purple-dim rounded-3xl p-5 sm:p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">BUDDY AI</span>
                            <span className="text-[10px] text-white/60">Ringkasan pagi ini</span>
                        </div>
                        {aiBrief ? (
                            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{aiBrief}</p>
                        ) : (
                            <>
                                <h2 className="text-base sm:text-lg font-bold mb-2">
                                    {loading ? "Memuat data bisnis Anda..." : "Dapatkan ringkasan AI hari ini"}
                                </h2>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    loading={briefLoading}
                                    onClick={generateBrief}
                                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 gap-1.5"
                                >
                                    {briefLoading ? "Menganalisis..." : (
                                        <><Sparkles className="w-3.5 h-3.5" /> Generate Daily Brief</>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-8">
                    <Card>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-buddy-purple" />
                            </div>
                            <div>
                                <p className="font-bold text-buddy-text-main text-sm">Highlight Hari Ini</p>
                                <p className="text-[10px] text-buddy-text-subtle">Data real-time bisnis Anda</p>
                            </div>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center py-8 gap-2 text-buddy-text-muted">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Memuat...</span>
                            </div>
                        ) : highlights.length === 0 ? (
                            <p className="text-sm text-buddy-text-muted text-center py-8">Belum ada data hari ini</p>
                        ) : (
                            <div className="space-y-3">
                                {highlights.map((item, idx) => (
                                    <div key={idx} className={`${item.bg} rounded-2xl p-4`}>
                                        <div className="flex items-start gap-3">
                                            <span className={`${item.color} mt-0.5 shrink-0`}>{item.icon}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-buddy-text-main">{item.title}</p>
                                                <p className="text-xs text-buddy-text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <Card className="h-full">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-buddy-text-main text-sm">Agenda Hari Ini</p>
                                <p className="text-[10px] text-buddy-text-subtle">{agenda.length} item terjadwal</p>
                            </div>
                        </div>
                        {agenda.length === 0 ? (
                            <p className="text-sm text-buddy-text-muted text-center py-6">Belum ada agenda</p>
                        ) : (
                            <div className="space-y-3">
                                {agenda.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                        <span className="text-[11px] font-bold text-buddy-purple bg-buddy-purple/5 px-2 py-1 rounded-lg block shrink-0">
                                            {item.time}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-buddy-text-main leading-tight">{item.title}</p>
                                            {item.tag && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${tagColors[item.tag] ?? "bg-gray-100 text-gray-600"}`}>
                                                    {item.tag}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <Button variant="ghost" size="sm" className="w-full justify-center gap-2">
                                <Plus className="w-3.5 h-3.5" />
                                Tambah Agenda
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
