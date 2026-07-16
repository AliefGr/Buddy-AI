"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ReportAiSummary() {
    const [brief, setBrief] = useState("");
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    async function generateSummary() {
        setLoading(true);
        try {
            const res = await fetch("/api/ai/daily-brief", { method: "POST" });
            const data = await res.json();
            if (res.ok) { setBrief(data.brief); setGenerated(true); }
        } finally { setLoading(false); }
    }

    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-buddy-purple" />
                </div>
                <div>
                    <p className="font-bold text-buddy-text-main text-sm">Ringkasan AI</p>
                    <p className="text-[10px] text-buddy-text-subtle">Analisis performa bisnis</p>
                </div>
            </div>

            {generated && brief ? (
                <div className="bg-buddy-purple/5 rounded-2xl p-4 border border-buddy-purple/10 flex-1">
                    <p className="text-sm text-buddy-text-main leading-relaxed whitespace-pre-wrap">{brief}</p>
                </div>
            ) : (
                <div className="space-y-3 flex-1">
                    {[
                        { icon: <TrendingUp className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-50", text: "Klik 'Analisis' untuk mendapatkan ringkasan performa bisnis dari AI." },
                        { icon: <AlertCircle className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50", text: "AI akan menganalisis revenue, stok, dan pelanggan Anda." },
                        { icon: <Lightbulb className="w-4 h-4" />, color: "text-buddy-purple", bg: "bg-buddy-purple/5", text: "Dapatkan rekomendasi actionable berdasarkan data real bisnis Anda." },
                    ].map((h, idx) => (
                        <div key={idx} className={`${h.bg} rounded-xl p-3 flex gap-2.5`}>
                            <span className={`${h.color} mt-0.5 shrink-0`}>{h.icon}</span>
                            <p className="text-xs text-buddy-text-main leading-relaxed">{h.text}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <Button variant="secondary" size="sm" className="w-full justify-center gap-2" loading={loading} onClick={generateSummary}>
                    {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menganalisis...</> : <><Sparkles className="w-3.5 h-3.5" /> {generated ? "Refresh Analisis" : "Analisis dengan AI"}</>}
                </Button>
            </div>
        </Card>
    );
}
