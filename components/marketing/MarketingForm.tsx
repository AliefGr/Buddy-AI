"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";


const audiences = [
    "Remaja (15-24 tahun)",
    "Dewasa Muda (25-35 tahun)",
    "Profesional (30-45 tahun)",
    "Ibu Rumah Tangga",
];

const tones = ["Formal", "Casual", "Persuasive", "Friendly", "Urgent"];

const platforms = [
    { id: "instagram", label: "Instagram", emoji: "📸" },
    { id: "whatsapp", label: "WhatsApp", emoji: "💬" },
    { id: "tiktok", label: "TikTok", emoji: "🎵" },
    { id: "email", label: "Email", emoji: "📧" },
];

export interface MarketingFormData {
    product: string;
    audience: string;
    tone: string;
    platforms: string[];
}

interface Product {
    id: string;
    name: string;
}

interface MarketingFormProps {
    onGenerate: (data: MarketingFormData) => void;
    loading: boolean;
    products?: Product[];
}

export function MarketingForm({ onGenerate, loading, products: dbProducts }: MarketingFormProps) {
    const productList = dbProducts && dbProducts.length > 0
        ? dbProducts.map(p => p.name)
        : ["Kopi Susu Gula Aren", "Espresso", "Matcha Latte", "Croissant", "Cookies"];
    const [product, setProduct] = useState(productList[0]);
    const [audience, setAudience] = useState(audiences[1]);
    const [tone, setTone] = useState("Casual");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);

    function togglePlatform(id: string) {
        setSelectedPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onGenerate({ product, audience, tone, platforms: selectedPlatforms });
    }

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-buddy-purple" />
                </div>
                <div>
                    <p className="font-bold text-buddy-text-main text-sm">Generate Konten</p>
                    <p className="text-[10px] text-buddy-text-subtle">Isi form untuk generate konten AI</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                {/* Product */}
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-2">
                        Produk
                    </label>
                    <div className="relative">
                        <select
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm text-buddy-text-main appearance-none pr-9 focus:outline-none"
                        >
                            {productList.map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle pointer-events-none" />
                    </div>
                </div>

                {/* Target Audience */}
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-2">
                        Target Audiens
                    </label>
                    <div className="relative">
                        <select
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm text-buddy-text-main appearance-none pr-9 focus:outline-none"
                        >
                            {audiences.map((a) => (
                                <option key={a}>{a}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle pointer-events-none" />
                    </div>
                </div>

                {/* Tone */}
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-2">
                        Tone
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {tones.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTone(t)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${tone === t
                                    ? "bg-buddy-purple text-white border-buddy-purple"
                                    : "bg-white text-buddy-text-muted border-buddy-border hover:border-buddy-purple hover:text-buddy-purple"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platform */}
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-2">
                        Platform
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {platforms.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => togglePlatform(p.id)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${selectedPlatforms.includes(p.id)
                                    ? "bg-buddy-purple/5 border-buddy-purple text-buddy-purple"
                                    : "bg-white border-buddy-border text-buddy-text-muted hover:border-buddy-purple/50"
                                    }`}
                            >
                                <span>{p.emoji}</span>
                                <span>{p.label}</span>
                                {selectedPlatforms.includes(p.id) && (
                                    <span className="ml-auto w-4 h-4 bg-buddy-purple rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={loading}
                        className="w-full justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate Konten AI
                    </Button>
                </div>
            </form>
        </Card>
    );
}
