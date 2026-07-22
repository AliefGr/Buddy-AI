"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, FileText, Search, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Product } from "./ProductTable";

interface Insight {
    icon: React.ReactNode;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    apply: (product: Product) => Partial<Product>; // Function to get changes for this insight
}

function generateInsights(product: Product): Insight[] {
    const insights: Insight[] = [];

    // Check if price is low compared to a mock average
    const averagePrice = 30000; // Mock average
    if (product.price < averagePrice * 0.8) {
        insights.push({
            icon: <AlertCircle className="w-4 h-4" />,
            title: "Harga terlalu murah",
            description: `Harga produk ini ${Math.round((1 - product.price / averagePrice) * 100)}% di bawah rata-rata pasar. Naikkan untuk margin lebih baik.`,
            priority: "high",
            apply: () => ({ price: Math.round(averagePrice * 0.9) }),
        });
    }

    // Check description length
    if (!product.description || product.description.length < 50) {
        insights.push({
            icon: <FileText className="w-4 h-4" />,
            title: "Deskripsi terlalu pendek",
            description: "Deskripsi produk kurang dari 50 kata. Tambahkan detail untuk meningkatkan konversi.",
            priority: "medium",
            apply: () => ({ description: `${product.name} adalah produk berkualitas tinggi yang cocok untuk kebutuhan Anda. Dapatkan sekarang juga!` }),
        });
    }

    // Add a default low priority insight
    insights.push({
        icon: <Search className="w-4 h-4" />,
        title: "Optimalkan pencarian",
        description: `Tambahkan kata kunci yang relevan dengan "${product.name}" untuk meningkatkan SEO toko.`,
        priority: "low",
        apply: () => ({}),
    });

    return insights;
}

const priorityColors = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-blue-50 text-blue-600 border-blue-100",
};

const priorityLabels = {
    high: "Prioritas Tinggi",
    medium: "Prioritas Sedang",
    low: "Prioritas Rendah",
};

interface ProductAiDrawerProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
    onProductUpdated: () => void; // Callback to refresh products list
}

export function ProductAiDrawer({ product, open, onClose, onProductUpdated }: ProductAiDrawerProps) {
    const [loading, setLoading] = useState(false);
    const insights = product ? generateInsights(product) : [];

    const handleApplyAll = async () => {
        if (!product) return;

        setLoading(true);
        try {
            // Combine all changes from insights
            const changes: Partial<Product> = {};
            for (const insight of insights) {
                const insightChanges = insight.apply(product);
                Object.assign(changes, insightChanges);
            }

            // Make API call to update the product
            if (Object.keys(changes).length > 0) {
                const res = await fetch(`/api/products/${product.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(changes),
                });

                if (res.ok) {
                    alert("Saran berhasil diterapkan!");
                    onProductUpdated(); // Refresh products list
                    onClose();
                } else {
                    alert("Gagal menerapkan saran.");
                }
            } else {
                alert("Tidak ada saran yang bisa diterapkan.");
            }
        } catch (error) {
            console.error("Error applying insights:", error);
            alert("Terjadi kesalahan saat menerapkan saran.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-buddy-purple" />
                        </div>
                        <div>
                            <p className="font-bold text-buddy-text-main text-sm">Buddy AI</p>
                            <p className="text-[10px] text-buddy-text-subtle">Analisis Produk</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-buddy-text-muted" />
                    </button>
                </div>

                {/* Product Info */}
                {product && (
                    <div className="px-6 py-4 bg-buddy-bg border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-lg">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <span className="text-gray-400 text-xs font-bold">{product.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-buddy-text-main text-sm">{product.name}</p>
                                <p className="text-[10px] text-buddy-text-subtle">{product.category.name} · AI Score: {product.aiScore ?? "—"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p className="text-sm text-buddy-text-muted">
                        Saya menemukan <span className="font-bold text-buddy-text-main">{insights.length} peluang</span> untuk meningkatkan performa produk ini.
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-buddy-purple" />
                        </div>
                    ) : (
                        insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-2xl border ${priorityColors[insight.priority]} flex gap-3`}
                            >
                                <div className="mt-0.5 shrink-0">{insight.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="font-semibold text-sm">{insight.title}</p>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 shrink-0">
                                            {priorityLabels[insight.priority]}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-80 leading-relaxed">{insight.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 space-y-3">
                    <Button
                        variant="primary"
                        size="md"
                        className="w-full justify-center gap-2"
                        onClick={handleApplyAll}
                        loading={loading}
                    >
                        <Check className="w-4 h-4" />
                        Terapkan Semua Saran
                    </Button>
                    <Button variant="ghost" size="md" className="w-full justify-center" onClick={onClose}>
                        Nanti Saja
                    </Button>
                </div>
            </div>
        </>
    );
}