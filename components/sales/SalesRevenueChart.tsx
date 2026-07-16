"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";

const datasets: Record<string, number[]> = {
    "7 Hari": [45, 62, 38, 78, 55, 90, 72],
    "30 Hari": [30, 45, 60, 35, 80, 55, 70, 40, 65, 85, 50, 72, 45, 60, 80, 35, 55, 70, 88, 62, 45, 78, 55, 90, 72, 40, 65, 82, 55, 70],
    "12 Bulan": [65, 72, 80, 68, 90, 85, 95, 78, 88, 92, 85, 110],
};

const labels: Record<string, string[]> = {
    "7 Hari": ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    "30 Hari": Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    "12 Bulan": ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
};

type Period = "7 Hari" | "30 Hari" | "12 Bulan";

function drawRevenueChart(
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number
) {
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Grid lines
    const gridLines = 5;
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Y labels
        const val = max - ((range / gridLines) * i);
        ctx.fillStyle = "#9ca3af";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(val > 100 ? `${Math.round(val)}k` : `${Math.round(val)}`, padding.left - 8, y + 3);
    }

    const stepX = chartW / (data.length - 1);
    const toY = (v: number) => padding.top + chartH - ((v - min) / range) * chartH;

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, "rgba(109, 93, 246, 0.18)");
    gradient.addColorStop(1, "rgba(109, 93, 246, 0)");

    ctx.beginPath();
    ctx.moveTo(padding.left, toY(data[0]));
    for (let i = 1; i < data.length; i++) {
        const x = padding.left + i * stepX;
        const y = toY(data[i]);
        const prevX = padding.left + (i - 1) * stepX;
        const prevY = toY(data[i - 1]);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
    ctx.lineTo(padding.left + (data.length - 1) * stepX, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#6D5DF6";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(padding.left, toY(data[0]));
    for (let i = 1; i < data.length; i++) {
        const x = padding.left + i * stepX;
        const y = toY(data[i]);
        const prevX = padding.left + (i - 1) * stepX;
        const prevY = toY(data[i - 1]);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
    ctx.stroke();

    // Dots for last point
    const lastX = padding.left + (data.length - 1) * stepX;
    const lastY = toY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#6D5DF6";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
}

export function SalesRevenueChart() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [period, setPeriod] = useState<Period>("7 Hari");

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
        drawRevenueChart(ctx, datasets[period], canvas.offsetWidth, canvas.offsetHeight);
    }, [period]);

    return (
        <Card className="col-span-1 lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-buddy-text-main">Revenue Chart</h3>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(["7 Hari", "30 Hari", "12 Bulan"] as Period[]).map((p) => (
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
            <div className="h-64 relative">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-semibold justify-center">
                <span className="w-2.5 h-2.5 bg-buddy-purple rounded-full" />
                <span>Revenue (Rp Juta)</span>
            </div>
        </Card>
    );
}
