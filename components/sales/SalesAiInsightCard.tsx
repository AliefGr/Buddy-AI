import { Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const insights = [
    {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: "text-red-500",
        bg: "bg-red-50",
        text: "Revenue turun 12% karena produk A habis.",
        action: "Restock sekarang",
    },
    {
        icon: <Sparkles className="w-4 h-4" />,
        color: "text-buddy-purple",
        bg: "bg-buddy-purple/5",
        text: "Penjualan tertinggi Sabtu 14.00–17.00. Optimalkan promosi di jam tersebut.",
        action: "Buat promo",
    },
    {
        icon: <ArrowRight className="w-4 h-4" />,
        color: "text-green-600",
        bg: "bg-green-50",
        text: "Bundling Kopi + Cookies berpotensi naikkan AOV 18%.",
        action: "Coba bundling",
    },
];

export function SalesAiInsightCard() {
    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-buddy-purple" />
                </div>
                <div>
                    <p className="font-bold text-buddy-text-main text-sm">Buddy AI Insight</p>
                    <p className="text-[10px] text-buddy-text-subtle">3 insight baru hari ini</p>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {insights.map((insight, idx) => (
                    <div key={idx} className={`${insight.bg} rounded-2xl p-3`}>
                        <div className="flex gap-2.5">
                            <span className={`${insight.color} mt-0.5 shrink-0`}>{insight.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-buddy-text-main leading-relaxed mb-2">{insight.text}</p>
                                <button className={`text-[10px] font-bold ${insight.color} flex items-center gap-1 hover:underline`}>
                                    {insight.action}
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <Button variant="secondary" size="sm" className="w-full justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Lihat Semua Insight
                </Button>
            </div>
        </Card>
    );
}
