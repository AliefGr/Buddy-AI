"use client";

import { Card } from "@/components/ui/Card";

const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const hours = Array.from({ length: 24 }, (_, i) =>
    i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`
);

// Simulate purchase frequency data (0–10)
function generateHeatmapData(): number[][] {
    return days.map((_, d) =>
        hours.map((_, h) => {
            // Peak hours: 7-9am (morning coffee), 12-14pm (lunch), 15-17pm (afternoon)
            const isMorningPeak = h >= 7 && h <= 9;
            const isLunchPeak = h >= 12 && h <= 14;
            const isAfternoonPeak = h >= 15 && h <= 17;
            const isWeekend = d >= 5;

            let base = 0;
            if (isMorningPeak) base = 6;
            if (isLunchPeak) base = 5;
            if (isAfternoonPeak) base = 7;
            if (isWeekend && (isMorningPeak || isAfternoonPeak)) base += 2;
            if (h < 6 || h >= 21) base = 0;

            return Math.min(10, Math.max(0, base + Math.floor(Math.random() * 3) - 1));
        })
    );
}

const heatmapData = generateHeatmapData();

function getCellColor(value: number): string {
    if (value === 0) return "bg-gray-100";
    if (value <= 2) return "bg-purple-100";
    if (value <= 4) return "bg-purple-200";
    if (value <= 6) return "bg-purple-400";
    if (value <= 8) return "bg-buddy-purple";
    return "bg-buddy-purple-dim";
}

export function AnalyticsCustomerHeatmap() {
    return (
        <Card className="col-span-1 lg:col-span-8">
            <div className="mb-5">
                <h3 className="font-bold text-buddy-text-main">Heatmap Aktivitas Pelanggan</h3>
                <p className="text-xs text-buddy-text-muted mt-0.5">Frekuensi pembelian per jam & hari</p>
            </div>

            <div className="overflow-x-auto">
                {/* Hour labels */}
                <div className="flex mb-1 ml-10">
                    {hours.filter((_, i) => i % 3 === 0).map((h) => (
                        <div key={h} className="text-[8px] text-buddy-text-subtle font-medium" style={{ width: `${100 / 8}%` }}>
                            {h}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="space-y-1">
                    {days.map((day, d) => (
                        <div key={day} className="flex items-center gap-1">
                            <span className="text-[10px] text-buddy-text-muted font-medium w-8 shrink-0">{day}</span>
                            <div className="flex gap-0.5 flex-1">
                                {heatmapData[d].map((val, h) => (
                                    <div
                                        key={h}
                                        title={`${day} ${hours[h]}: ${val} transaksi`}
                                        className={`h-5 rounded-sm flex-1 transition-colors cursor-pointer hover:ring-2 hover:ring-buddy-purple/40 ${getCellColor(val)}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 justify-end">
                    <span className="text-[10px] text-buddy-text-subtle">Rendah</span>
                    {["bg-gray-100", "bg-purple-100", "bg-purple-200", "bg-purple-400", "bg-buddy-purple", "bg-buddy-purple-dim"].map((c, i) => (
                        <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />
                    ))}
                    <span className="text-[10px] text-buddy-text-subtle">Tinggi</span>
                </div>
            </div>
        </Card>
    );
}
