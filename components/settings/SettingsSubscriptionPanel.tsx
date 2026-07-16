import { Crown, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
    {
        id: "free",
        name: "Free",
        price: "Rp 0",
        period: "/bulan",
        current: true,
        features: [
            "Dashboard dasar",
            "Maksimal 10 produk",
            "Laporan mingguan",
            "AI Insight terbatas (5x/hari)",
        ],
        cta: "Plan Saat Ini",
        disabled: true,
        highlight: false,
    },
    {
        id: "pro",
        name: "Pro",
        price: "Rp 299.000",
        period: "/bulan",
        current: false,
        features: [
            "Semua fitur Free",
            "Produk tak terbatas",
            "Laporan real-time",
            "AI Insight tak terbatas",
            "Marketing AI",
            "Export PDF & Excel",
        ],
        cta: "Upgrade ke Pro",
        disabled: false,
        highlight: true,
    },
];

export function SettingsSubscriptionPanel() {
    return (
        <Card>
            <div className="flex items-center gap-2 mb-6">
                <Crown className="w-5 h-5 text-buddy-purple" />
                <h2 className="font-bold text-buddy-text-main">Paket Langganan</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`rounded-2xl p-5 border-2 transition-all ${plan.highlight
                                ? "border-buddy-purple bg-buddy-purple/3"
                                : "border-gray-100 bg-gray-50"
                            }`}
                    >
                        {plan.highlight && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-buddy-purple text-white px-2 py-0.5 rounded-full mb-2">
                                <Zap className="w-2.5 h-2.5" />
                                Recommended
                            </span>
                        )}
                        <h3 className="font-bold text-buddy-text-main text-lg mb-0.5">{plan.name}</h3>
                        <div className="flex items-baseline gap-0.5 mb-4">
                            <span className={`text-2xl font-bold ${plan.highlight ? "text-buddy-purple" : "text-buddy-text-main"}`}>
                                {plan.price}
                            </span>
                            <span className="text-xs text-buddy-text-muted">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-5">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-start gap-2">
                                    <Check
                                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.highlight ? "text-buddy-purple" : "text-green-500"
                                            }`}
                                    />
                                    <span className="text-xs text-buddy-text-muted">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <Button
                            variant={plan.highlight ? "primary" : "ghost"}
                            size="sm"
                            className="w-full justify-center"
                            disabled={plan.disabled}
                        >
                            {plan.current ? "Plan Saat Ini" : plan.cta}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="bg-buddy-purple/5 rounded-2xl p-4 border border-buddy-purple/10">
                <p className="text-xs text-buddy-text-muted text-center">
                    Semua plan sudah termasuk 14 hari uji coba gratis.{" "}
                    <a href="#" className="text-buddy-purple font-semibold hover:underline">
                        Hubungi kami
                    </a>{" "}
                    untuk paket enterprise.
                </p>
            </div>
        </Card>
    );
}
