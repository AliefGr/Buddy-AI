"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ToggleItem {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

export function SettingsNotifPanel() {
    const [items, setItems] = useState<ToggleItem[]>([
        { id: "stock", label: "Peringatan Stok Rendah", description: "Notifikasi saat stok mendekati batas minimum", enabled: true },
        { id: "order", label: "Pesanan Baru", description: "Notifikasi setiap ada pesanan masuk", enabled: true },
        { id: "ai", label: "AI Insight Baru", description: "Pemberitahuan saat ada insight bisnis terbaru", enabled: true },
        { id: "report", label: "Laporan Mingguan", description: "Ringkasan performa setiap Senin pagi", enabled: false },
        { id: "promo", label: "Reminder Promo", description: "Pengingat untuk jadwal promo yang telah dibuat", enabled: false },
    ]);

    function toggle(id: string) {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
        );
    }

    return (
        <Card>
            <h2 className="font-bold text-buddy-text-main mb-6">Preferensi Notifikasi</h2>
            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                            <p className="text-sm font-semibold text-buddy-text-main">{item.label}</p>
                            <p className="text-xs text-buddy-text-muted">{item.description}</p>
                        </div>
                        <button
                            onClick={() => toggle(item.id)}
                            className={`relative w-11 h-6 rounded-full transition-all ${item.enabled ? "bg-buddy-purple" : "bg-gray-200"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.enabled ? "left-[22px]" : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <Button variant="primary" size="md" className="gap-2">
                    <Save className="w-4 h-4" />
                    Simpan
                </Button>
            </div>
        </Card>
    );
}
