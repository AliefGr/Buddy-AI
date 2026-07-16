"use client";

import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, TrendingDown, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface KpiData {
    revenue: { value: number; trend: number };
    orders: { value: number; trend: number };
    customers: { total: number; newThisMonth: number };
}

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function AnalyticsAiSummary() {
    const [data, setData] = useState<KpiData | null>(null);
    const [aiSummary, setAiSummary] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/dashboard/kpi").then(r => r.json()).then(setData).catch(() => { });
    }, []);

    async function generateSummary() {
        setLoading(true);
        try {
            const res = await fetch("/api/ai/daily-brief", { method: "POST" });
            const d = await res.json();
            if (res.ok) setAiSummary(d.brief);
        } finally { setLoading(false); }
    }

    const trend = data?.revenue.trend ?? 0;

    return (
        <div className="mb-6 bg-gradient-to-r from-buddy-purple to-buddy-purple-dim rounded-3xl p-6 text-white">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">AI SUMMARY</span>
                        <span className="text-[10px] text-white/60">Data real-time</span>
                    </div>
                    {aiSummary ? (
                        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap line-clamp-4">{aiSummary}</p>
                    ) : data ? (
                        <>
                            <h2 className="text-lg font-bold mb-1">
                                Revenue bulan ini{" "}
                                <span className="bg-white/20 px-2 py-0.5 rounded-lg">
                                    {trend >= 0 ? `+${trend}%` : `${trend}%`}
                                </span>
                            </h2>
                            <p className="text-sm text-white/80 leading-relaxed">
                                Total omzet: {formatRupiah(data.revenue.value)} · {data.orders.value} transaksi · {data.customers.newThisMonth} pelanggan baru bulan ini.
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-white/70">Memuat data bisnis Anda...</p>
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        loading={loading}
                        onClick={generateSummary}
                        className="mt-3 bg-white/20 text-white border-white/30 hover:bg-white/30 gap-1.5"
                    >
                        {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Menganalisis...</> : <><Zap className="w-3.5 h-3.5" />Generate AI Summary</>}
                    </Button>
                </div>
                {data && (
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1 bg-white/20 rounded-xl px-3 py-1.5">
                            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm font-bold">{trend >= 0 ? `+${trend}%` : `${trend}%`}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 rounded-xl px-3 py-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-xs">{data.orders.value} order</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
