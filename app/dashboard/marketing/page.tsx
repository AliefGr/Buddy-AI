"use client";

import { useState, useEffect } from "react";
import { MarketingForm } from "@/components/marketing/MarketingForm";
import { MarketingAiResult } from "@/components/marketing/MarketingAiResult";
import type { MarketingFormData } from "@/components/marketing/MarketingForm";

interface Product {
    id: string;
    name: string;
}

export default function MarketingPage() {
    const [result, setResult] = useState<string | null>(null);
    const [formData, setFormData] = useState<MarketingFormData | null>(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/products?limit=20")
            .then(r => r.json())
            .then(d => setProducts(d.data ?? []))
            .catch(() => { });
    }, []);

    async function handleGenerate(data: MarketingFormData) {
        setFormData(data);
        setLoading(true);
        setResult(null);
        try {
            const platform = data.platforms[0] ?? "instagram";
            const res = await fetch("/api/ai/marketing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "caption",
                    platform,
                    productName: data.product,
                    audience: data.audience,
                    tone: data.tone,
                }),
            });
            const json = await res.json();
            if (res.ok) {
                setResult(json.content);
            } else {
                setResult(`Error: ${json.error ?? "Gagal generate konten"}`);
            }
        } catch {
            setResult("Terjadi kesalahan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    function handleRegenerate() {
        if (!formData) return;
        handleGenerate(formData);
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main">Marketing AI</h1>
                <p className="text-sm text-buddy-text-muted">
                    Generate konten marketing untuk semua platform dengan bantuan AI
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <MarketingForm onGenerate={handleGenerate} loading={loading} products={products} />
                <MarketingAiResult
                    result={result}
                    formData={formData}
                    loading={loading}
                    onRegenerate={handleRegenerate}
                />
            </div>
        </>
    );
}
