"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface MonthlyData {
    month: string;
    revenue: number;
    orders: number;
}

interface ReportTableProps {
    data: MonthlyData[];
    loading: boolean;
}

function formatRupiah(n: number) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function ReportTable({ data, loading }: ReportTableProps) {
    return (
        <Card padding="none" overflow className="col-span-1 lg:col-span-8">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-buddy-text-main">Laporan Penjualan</h3>
                <p className="text-xs text-buddy-text-muted mt-0.5">30 hari terakhir</p>
            </div>
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-buddy-text-muted">
                        <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Memuat...</span>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-sm text-buddy-text-muted text-center py-12">Belum ada data penjualan</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {["Periode", "Revenue", "Est. Pengeluaran", "Est. Profit", "Transaksi"].map(h => (
                                    <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map((row, idx) => {
                                const estExpense = Math.round(row.revenue * 0.35);
                                const estProfit = row.revenue - estExpense;
                                const isLatest = idx === data.length - 1;
                                return (
                                    <tr key={row.month} className={`hover:bg-gray-50/50 transition-colors ${isLatest ? "bg-buddy-purple/2" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {isLatest && <span className="w-2 h-2 bg-buddy-purple rounded-full" />}
                                                <span className={`font-semibold ${isLatest ? "text-buddy-purple" : "text-buddy-text-main"}`}>{row.month}</span>
                                                {isLatest && <span className="text-[9px] font-bold bg-buddy-purple/10 text-buddy-purple px-1.5 py-0.5 rounded-full">Terkini</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-buddy-text-main">{formatRupiah(row.revenue)}</td>
                                        <td className="px-6 py-4 text-buddy-text-muted">{formatRupiah(estExpense)}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{formatRupiah(estProfit)}</td>
                                        <td className="px-6 py-4 text-buddy-text-main">{row.orders} hari aktif</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}
