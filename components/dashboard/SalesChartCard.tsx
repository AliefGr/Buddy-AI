"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";

interface ChartPoint { date: string; revenue: number; label: string; }

function drawChart(ctx: CanvasRenderingContext2D, data: ChartPoint[], w: number, h: number) {
    ctx.clearRect(0, 0, w, h);
    if (data.length < 2) return;
    const values = data.map(d => d.revenue);
    const max = Math.max(...values, 1);
    ctx.beginPath();
    ctx.strokeStyle = "#f1f1f1";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) { ctx.moveTo(0, (h / 4) * i); ctx.lineTo(w, (h / 4) * i); }
    ctx.stroke();
    const stepX = w / (data.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(109,93,246,1)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(0, h - (values[0] / max) * (h - 10));
    for (let i = 1; i < values.length; i++) {
        const x = i * stepX, y = h - (values[i] / max) * (h - 10);
        const px = (i - 1) * stepX, py = h - (values[i - 1] / max) * (h - 10);
        ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
    }
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(109,93,246,0.2)");
    grad.addColorStop(1, "rgba(109,93,246,0)");
    ctx.lineTo(w, h); ctx.lineTo(0, h);
    ctx.fillStyle = grad; ctx.fill();
}

function fmt(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

export function SalesChartCard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [days, setDays] = useState(7);

    useEffect(() => {
        fetch(`/api/dashboard/sales-chart?days=${days}`)
            .then(r => r.json()).then(setChartData).catch(() => { });
    }, [days]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || chartData.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawChart(ctx, chartData, canvas.width, canvas.height);
    }, [chartData]);

    const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

    return (
        <Card className="col-span-1 lg:col-span-8">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="font-bold text-buddy-text-main">Grafik Penjualan</h3>
                    <p className="text-xs text-buddy-text-muted mt-0.5">Total: {fmt(totalRevenue)}</p>
                </div>
                <select
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-lg py-1 px-3 outline-none"
                >
                    <option value={7}>7 Hari Terakhir</option>
                    <option value={30}>30 Hari Terakhir</option>
                </select>
            </div>
            <div className="h-64 relative mt-4">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            {chartData.length > 0 && (
                <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 px-1">
                    <span>{chartData[0]?.label}</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-buddy-purple rounded-full inline-block" />
                        <span className="font-semibold text-gray-500">Omzet (Rp)</span>
                    </div>
                    <span>{chartData[chartData.length - 1]?.label}</span>
                </div>
            )}
        </Card>
    );
}
