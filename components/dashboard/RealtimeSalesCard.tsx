"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { Card } from "@/components/ui/Card";

interface TodayData {
    revenue: number;
    revenueTrend: number;
    orders: number;
    avgOrder: number;
}

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

function drawChart(ctx: CanvasRenderingContext2D, data: number[], w: number, h: number) {
    ctx.clearRect(0, 0, w, h);
    if (data.length < 2) return;
    const max = Math.max(...data, 1);
    const stepX = w / (data.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(109,93,246,1)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(0, h - (data[0] / max) * (h - 10));
    for (let i = 1; i < data.length; i++) {
        const x = i * stepX;
        const y = h - (data[i] / max) * (h - 10);
        const px = (i - 1) * stepX;
        const py = h - (data[i - 1] / max) * (h - 10);
        ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
    }
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(109,93,246,0.2)");
    grad.addColorStop(1, "rgba(109,93,246,0)");
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = grad;
    ctx.fill();
}

export function RealtimeSalesCard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<TodayData | null>(null);
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        fetch("/api/dashboard/today").then(r => r.json()).then(setData).catch(() => { });
        fetch("/api/dashboard/sales-chart?days=7")
            .then(r => r.json())
            .then((d: { revenue: number }[]) => setChartData(d.map(p => p.revenue)))
            .catch(() => { });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || chartData.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawChart(ctx, chartData, canvas.width, canvas.height);
    }, [chartData]);

    return (
        <Card className="col-span-1 lg:col-span-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-buddy-text-main">Penjualan Hari Ini</h3>
                <Badge variant="live" animated>Live</Badge>
            </div>
            <div className="mb-6">
                <p className="text-xs text-gray-400">Omzet Hari Ini</p>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-buddy-text-main">
                        {data ? formatRupiah(data.revenue) : "—"}
                    </span>
                    {data && (
                        <TrendBadge
                            value={`${Math.abs(data.revenueTrend)}%`}
                            direction={data.revenueTrend >= 0 ? "up" : "down"}
                            suffix="dari kemarin"
                            className="mb-1"
                        />
                    )}
                </div>
            </div>
            <div className="h-24 w-full mb-6">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-100 rounded-2xl">
                    <p className="text-[10px] text-gray-400 mb-1">Transaksi</p>
                    <span className="font-bold text-buddy-text-main">{data?.orders ?? "—"}</span>
                </div>
                <div className="p-3 border border-gray-100 rounded-2xl">
                    <p className="text-[10px] text-gray-400 mb-1">Avg. Order</p>
                    <span className="font-bold text-xs text-buddy-text-main">
                        {data ? formatRupiah(data.avgOrder) : "—"}
                    </span>
                </div>
            </div>
        </Card>
    );
}
