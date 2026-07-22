"use client";

import { Layers, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { useState, useEffect } from "react";

interface Stats {
    totalStock: number;
    lowStock: number;
    outOfStock: number;
    needsRestock: number;
}

export function InventoryStatsRow() {
    const [stats, setStats] = useState<Stats>({
        totalStock: 0,
        lowStock: 0,
        outOfStock: 0,
        needsRestock: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/inventory");
                if (res.ok) {
                    const items = await res.json();
                    let totalStock = 0;
                    let lowStock = 0;
                    let outOfStock = 0;
                    let needsRestock = 0;
                    
                    items.forEach((item: any) => {
                        totalStock += item.currentStock;
                        if (item.status === "LOW") {
                            lowStock++;
                            needsRestock++;
                        } else if (item.status === "EMPTY") {
                            outOfStock++;
                            needsRestock++;
                        }
                    });
                    
                    setStats({ totalStock, lowStock, outOfStock, needsRestock });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statsData = [
        {
            label: "Total Stok",
            value: stats.totalStock.toLocaleString("id-ID"),
            icon: <Layers className="w-5 h-5" />,
            color: "purple" as const,
            sub: "Semua item",
        },
        {
            label: "Stok Rendah",
            value: stats.lowStock.toString(),
            icon: <AlertTriangle className="w-5 h-5" />,
            color: "amber" as const,
            sub: "Perlu perhatian",
        },
        {
            label: "Habis",
            value: stats.outOfStock.toString(),
            icon: <XCircle className="w-5 h-5" />,
            color: "red" as const,
            sub: "Stok kosong",
        },
        {
            label: "Perlu Restock",
            value: stats.needsRestock.toString(),
            icon: <RefreshCw className="w-5 h-5" />,
            color: "blue" as const,
            sub: "Segera order",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat) => (
                <Card key={stat.label} padding="md" className="flex items-center gap-4">
                    <IconBox color={stat.color} size="lg">
                        {stat.icon}
                    </IconBox>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-buddy-text-main">
                            {loading ? "..." : stat.value}
                        </p>
                        <p className="text-[10px] text-buddy-text-subtle">{stat.sub}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
