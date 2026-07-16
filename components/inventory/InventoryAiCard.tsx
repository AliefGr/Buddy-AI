import { Sparkles, ArrowRight, Clock, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const recommendations = [
    {
        urgency: "Kritis",
        urgencyColor: "bg-red-100 text-red-600",
        product: "Arabica Beans",
        message: "Segera lakukan restock Arabica. Estimasi habis",
        eta: "2 Hari",
        qty: "20 kg",
        icon: "☕",
    },
    {
        urgency: "Segera",
        urgencyColor: "bg-amber-100 text-amber-700",
        product: "Gula Aren Cair",
        message: "Stok Gula Aren hampir habis. Estimasi habis",
        eta: "3 Hari",
        qty: "10 liter",
        icon: "🍯",
    },
    {
        urgency: "Perlu Order",
        urgencyColor: "bg-blue-100 text-blue-700",
        product: "Butter Croissant",
        message: "Butter Croissant butuh restock sebelum",
        eta: "5 Hari",
        qty: "50 pcs",
        icon: "🥐",
    },
];

export function InventoryAiCard() {
    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-buddy-purple" />
                </div>
                <div>
                    <p className="font-bold text-buddy-text-main text-sm">Rekomendasi AI</p>
                    <p className="text-[10px] text-buddy-text-subtle">Berdasarkan prediksi stok</p>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-base shadow-sm shrink-0">
                                {rec.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rec.urgencyColor}`}>
                                        {rec.urgency}
                                    </span>
                                    <span className="font-semibold text-buddy-text-main text-xs">{rec.product}</span>
                                </div>
                                <p className="text-[11px] text-buddy-text-muted leading-relaxed">
                                    {rec.message}{" "}
                                    <span className="font-bold text-buddy-text-main flex items-center gap-1 inline-flex">
                                        <Clock className="w-3 h-3" />
                                        {rec.eta}
                                    </span>
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <Package className="w-3 h-3 text-buddy-purple" />
                                    <span className="text-[10px] font-semibold text-buddy-purple">
                                        Rekomendasi: {rec.qty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <Button variant="primary" size="sm" className="w-full justify-center gap-2">
                    <Package className="w-3.5 h-3.5" />
                    Order Semua Restock
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-center gap-2">
                    Lihat Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                </Button>
            </div>
        </Card>
    );
}
