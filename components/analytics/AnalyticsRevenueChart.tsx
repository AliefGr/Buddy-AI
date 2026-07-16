"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";

type Period = "7 Hari" | "30 Hari";

function drawDualChart(
    ctx: CanvasRenderingContext2D,
    revenue: number[],
    profit: number[],
    w: number,
    h: number
) {
    ctx.clearRect(0, 0, w, h);
    const pad = { top: 20, right: 20, bottom: 30, left: 50 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;
    const max = Math.max(...revenue, ...profit);
    const toY = (v: number) => pad.top + ch - (v / max) * ch;

    // Grid
    for (let i = 0; i <= 5; i++) {
        const y = pad.top + (ch / 5) * i;
        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
        const val = max - (max / 5) * i;
        ctx.fillStyle = "#9ca3af";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.round(val)}`, pad.left - 8, y + 3);
    }

    function drawLine(data: number[], color: string, fillColor: string) {
        const step = cw / (data.length - 1);
        const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(pad.left, toY(data[0]));
        for (let i = 1; i < data.length; i++) {
            const x = pad.left + i * step;
            const px = pad.left + (i - 1) * step;
            const cp = (px + x) / 2;
            ctx.bezierCurveTo(cp, toY(data[i - 1]), cp, toY(data[i]), x, toY(data[i]));
        }
        ctx.lineTo(pad.left + (data.length - 1) * step, pad.top + ch);
        ctx.lineTo(pad.left, pad.top + ch);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.moveTo(pad.left, toY(data[0]));
        for (let i = 1; i < data.length; i++) {
            const x = pad.left + i * step;
            const px = pad.left + (i - 1) * step;
            const cp = (px + x) / 2;
            ctx.bezierCurveTo(cp, toY(data[i - 1]), cp, toY(data[i]), x, toY(data[i]));
        }
        ctx.stroke();
    }

    drawLine(revenue, "#6D5DF6", "rgba(109,93,246,0.18)");
    drawLine(profit, "#10B981", "rgba(16,185,129,0.12)");
}

interface ChartPoint { date: string; revenue: number; label: string; }

export function AnalyticsRevenueChart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [period, setPeriod] = useState<Period>("7 Hari");
    const [chartData, setChartData] = useState<ChartPoint[]>([]);

    useEffect(() => {
        const days = period === "7 Hari" ? 7 : 30;
        fetch(`/api/dashboard/sales-chart?days=${days}`)
            .then(r => r.json())
            .then(setChartData)
            .catch(() => { });
    }, [period]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || chartData.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
        const revenue = chartData.map(d => d.revenue / 10000); // scale to display units
        const profit = revenue.map(v => Math.round(v * 0.3)); // estimate profit ~30%
        drawDualChart(ctx, revenue, profit, canvas.offsetWidth, canvas.offsetHeight);
    }, [chartData]);

    return (
        <Card className="col-span-1 lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-buddy-text-main">Revenue & Profit</h3>
                    <p className="text-xs text-buddy-text-muted mt-0.5">Perbandingan revenue vs profit</p>
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(["7 Hari", "30 Hari"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${period === p
                                ? "bg-white text-buddy-purple shadow-sm"
                                : "text-buddy-text-muted hover:text-buddy-text-main"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-72 relative">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-gray-500 font-semibold">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-buddy-purple rounded-full" />
                    Revenue
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    Profit
                </div>
            </div>
        </Card>
    );
}
