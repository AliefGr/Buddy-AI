"use client";

import {
  Package,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { useState, useEffect } from "react";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
}

export function ProductStatsBar() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/products?limit=1000");
        if (res.ok) {
          const { data } = await res.json();
          let totalProducts = 0;
          let activeProducts = 0;
          let outOfStock = 0;
          let lowStock = 0;

          data.forEach((product: any) => {
            totalProducts++;
            if (product.isActive) activeProducts++;

            if (product.inventory) {
              if (product.inventory.status === "EMPTY") outOfStock++;
              else if (product.inventory.status === "LOW") lowStock++;
            }
          });

          setStats({ totalProducts, activeProducts, outOfStock, lowStock });
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
      label: "Total Produk",
      value: stats.totalProducts.toString(),
      icon: <Package className="w-5 h-5" />,
      color: "purple" as const,
      sub: "Semua produk",
    },
    {
      label: "Aktif",
      value: stats.activeProducts.toString(),
      icon: <CheckCircle className="w-5 h-5" />,
      color: "green" as const,
      sub: "Tersedia di toko",
    },
    {
      label: "Habis",
      value: stats.outOfStock.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "red" as const,
      sub: "Perlu restock",
    },
    {
      label: "Stok Rendah",
      value: stats.lowStock.toString(),
      icon: <TrendingDown className="w-5 h-5" />,
      color: "amber" as const,
      sub: "Di bawah minimum",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-6">
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
