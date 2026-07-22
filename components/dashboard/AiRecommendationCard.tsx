"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface AiRecommendation {
    id: string;
    type: string;
    title: string;
    description: string;
    impact: string;
    actionLabel: string;
    actionUrl: string;
}

interface RecommendationsResponse {
    recommendations: AiRecommendation[];
    generatedAt: string;
    source: "ai" | "fallback";
}

// Tag color mapping based on recommendation type keywords
function getTypeColor(type: string): string {
    const t = type.toLowerCase();
    if (t.includes("bundling") || t.includes("promo") || t.includes("diskon"))
        return "text-buddy-purple bg-buddy-purple/10";
    if (t.includes("stok") || t.includes("restock") || t.includes("inventory"))
        return "text-orange-600 bg-orange-50";
    if (t.includes("pelanggan") || t.includes("retensi") || t.includes("customer"))
        return "text-blue-600 bg-blue-50";
    if (t.includes("marketing") || t.includes("broadcast") || t.includes("campaign"))
        return "text-green-600 bg-green-50";
    return "text-buddy-purple bg-buddy-purple/10";
}

export function AiRecommendationCard() {
    const [data, setData] = useState<RecommendationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    async function fetchRecommendations(isRefresh = false) {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await fetch("/api/ai/recommendations");
            const json = await res.json();
            if (json && Array.isArray(json.recommendations)) {
                setData(json as RecommendationsResponse);
                setActiveIndex(0);
            }
        } catch {
            // silently fail — keep existing data
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const recs = data?.recommendations ?? [];
    const total = recs.length;
    const current = recs[activeIndex];

    function prev() {
        setActiveIndex((i) => (i - 1 + total) % total);
    }

    function next() {
        setActiveIndex((i) => (i + 1) % total);
    }

    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-buddy-purple" />
                    <h3 className="font-bold text-buddy-text-main">Rekomendasi AI</h3>
                    {data?.source === "ai" && (
                        <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                            LIVE
                        </span>
                    )}
                </div>
                <button
                    onClick={() => fetchRecommendations(true)}
                    disabled={loading || refreshing}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-40"
                    aria-label="Refresh rekomendasi"
                    title="Refresh rekomendasi"
                >
                    <RefreshCw
                        className={`w-3.5 h-3.5 text-gray-400 ${refreshing ? "animate-spin" : ""}`}
                    />
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                    <Loader2 className="w-6 h-6 text-buddy-purple animate-spin" />
                    <p className="text-xs text-gray-400">Menganalisis data bisnis...</p>
                </div>
            ) : !current ? (
                <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-xs text-gray-400 text-center">
                        Tidak ada rekomendasi tersedia saat ini.
                    </p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    {/* Recommendation content */}
                    <div className="flex-1 mb-4">
                        {/* Type badge */}
                        <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full mb-2 ${getTypeColor(current.type)}`}
                        >
                            {current.type}
                        </span>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-buddy-text-main mb-2 leading-snug">
                            {current.title}
                        </h4>

                        {/* Description */}
                        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                            {current.description}
                        </p>

                        {/* Impact pill */}
                        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            <span>📈</span>
                            <span>{current.impact}</span>
                        </div>
                    </div>

                    {/* Footer: pagination + CTA */}
                    <div className="flex items-center justify-between mt-auto">
                        {/* Dot navigation + arrows */}
                        <div className="flex items-center gap-1.5">
                            {total > 1 && (
                                <button
                                    onClick={prev}
                                    className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    aria-label="Rekomendasi sebelumnya"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                            {recs.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    aria-label={`Rekomendasi ${i + 1}`}
                                    className={`rounded-full transition-all ${i === activeIndex
                                            ? "w-4 h-1.5 bg-buddy-purple"
                                            : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
                                        }`}
                                />
                            ))}
                            {total > 1 && (
                                <button
                                    onClick={next}
                                    className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    aria-label="Rekomendasi berikutnya"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Action button */}
                        <Link href={current.actionUrl}>
                            <Button variant="secondary" size="sm">
                                {current.actionLabel}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </Card>
    );
}
