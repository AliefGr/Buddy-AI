import { Package, CheckCircle, AlertTriangle, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";

const stats = [
    {
        label: "Total Produk",
        value: "124",
        icon: <Package className="w-5 h-5" />,
        color: "purple" as const,
        sub: "Semua produk",
    },
    {
        label: "Aktif",
        value: "110",
        icon: <CheckCircle className="w-5 h-5" />,
        color: "green" as const,
        sub: "Tersedia di toko",
    },
    {
        label: "Habis",
        value: "12",
        icon: <AlertTriangle className="w-5 h-5" />,
        color: "red" as const,
        sub: "Perlu restock",
    },
    {
        label: "Stok Rendah",
        value: "8",
        icon: <TrendingDown className="w-5 h-5" />,
        color: "amber" as const,
        sub: "Di bawah minimum",
    },
];

export function ProductStatsBar() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {stats.map((stat) => (
                <Card key={stat.label} padding="md" className="flex items-center gap-4">
                    <IconBox color={stat.color} size="lg">
                        {stat.icon}
                    </IconBox>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                            {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-buddy-text-main">{stat.value}</p>
                        <p className="text-[10px] text-buddy-text-subtle">{stat.sub}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
