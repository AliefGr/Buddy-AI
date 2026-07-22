"use client";

import { ReportStatsRow } from "@/components/reports/ReportStatsRow";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportExportBar } from "@/components/reports/ReportExportBar";
import { ReportAiSummary } from "@/components/reports/ReportAiSummary";
import { useEffect, useState } from "react";

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export default function ReportsPage() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/sales-chart?days=30")
      .then((r) => r.json())
      .then((points: { date: string; revenue: number; label: string }[]) => {
        const monthMap: Record<string, { revenue: number; orders: number }> =
          {};
        for (const p of points) {
          const d = new Date(p.date);
          const key = d.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          });
          if (!monthMap[key]) monthMap[key] = { revenue: 0, orders: 0 };
          monthMap[key].revenue += p.revenue;
          monthMap[key].orders += p.revenue > 0 ? 1 : 0;
        }
        const result = Object.entries(monthMap).map(([month, v]) => ({
          month,
          ...v,
        }));
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-buddy-text-main">Laporan</h1>
          <p className="text-sm text-buddy-text-muted">
            Laporan keuangan dan performa bisnis bulanan
          </p>
        </div>
        <ReportExportBar data={data} />
      </div>

      {/* Stats */}
      <ReportStatsRow />

      {/* Table + AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <ReportTable data={data} loading={loading} />
        <ReportAiSummary />
      </div>
    </>
  );
}
