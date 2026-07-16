import { Layers, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";

const stats = [
    {
        label: "Total Stok",
        value: "4.280",
        icon: <Layers className="w-5 h-5" />,
        color: "purple" as const,
        sub: "Semua item",
    },
    {
        label: "Stok Rendah",
        value: "8",
        icon: <AlertTriangle className="w-5 h-5" />,
        color: "amber" as const,
        sub: "Perlu perhatian",
    },
    {
        label: "Habis",
        value: "3",
        icon: <XCircle className="w-5 h-5" />,
        color: "red" as const,
        sub: "Stok kosong",
    },
    {
        label: "Perlu Restock",
        value: "5",
        icon: <RefreshCw className="w-5 h-5" />,
        color: "blue" as const,
        sub: "Segera order",
    },
];

export function InventoryStatsRow() {
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
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
