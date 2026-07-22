"use client";

import { Sparkles, ArrowRight, Clock, Package, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

interface InventoryItem {
    id: string;
    currentStock: number;
    minStock: number;
    status: string;
    product: { name: string };
}

export function InventoryAiCard() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/inventory")
            .then(r => r.json())
            .then(data => {
                const lowStockItems = (data as InventoryItem[]).filter(
                    i => i.status === "LOW" || i.status === "EMPTY"
                );
                setInventory(lowStockItems);
            })
            .finally(() => setLoading(false));
    }, []);

    const recommendations = inventory.map(item => {
        const isEmpty = item.status === "EMPTY";
        const urgency = isEmpty ? "Kritis" : "Segera";
        const urgencyColor = isEmpty ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700";
        const recQty = Math.max(item.minStock - item.currentStock, item.minStock * 2);
        return {
            urgency,
            urgencyColor,
            product: item.product.name,
            message: isEmpty
                ? `Segera restock ${item.product.name}. Stok habis!`
                : `Stok ${item.product.name} hampir habis. Tersisa ${item.currentStock} unit.`,
            qty: `${recQty} unit`,
            icon: "📦",
        };
    });

    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-buddy-purple" />
                </div>
                <div>
                    <p className="font-bold text-buddy-text-main text-sm">Rekomendasi AI</p>
                    <p className="text-[10px] text-buddy-text-subtle">Berdasarkan prediksi stok</p>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {loading ? (
                    <div className="flex items-center justify-center py-8 gap-2 text-buddy-text-muted">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Memuat...</span>
                    </div>
                ) : recommendations.length === 0 ? (
                    <p className="text-sm text-buddy-text-muted text-center py-8">
                        Stok Anda semua aman! 👍
                    </p>
                ) : (
                    recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-base shadow-sm shrink-0">
                                    {rec.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rec.urgencyColor}`}>
                                            {rec.urgency}
                                        </span>
                                        <span className="font-semibold text-buddy-text-main text-xs">{rec.product}</span>
                                    </div>
                                    <p className="text-[11px] text-buddy-text-muted leading-relaxed">
                                        {rec.message}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Package className="w-3 h-3 text-buddy-purple" />
                                        <span className="text-[10px] font-semibold text-buddy-purple">
                                            Rekomendasi: {rec.qty}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <Button variant="primary" size="sm" className="w-full justify-center gap-2">
                    <Package className="w-3.5 h-3.5" />
                    Order Semua Restock
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-center gap-2">
                    Lihat Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                </Button>
            </div>
        </Card>
    );
}
