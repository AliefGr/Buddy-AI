import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { TrendBadge } from "@/components/ui/TrendBadge";

interface KpiCardProps {
    icon: React.ReactNode;
    iconColor: "purple" | "blue" | "green" | "orange" | "amber" | "red" | "gray";
    label: string;
    value: string;
    trend: string;
    trendDirection?: "up" | "down";
    trendSuffix?: string;
}

export function KpiCard({
    icon,
    iconColor,
    label,
    value,
    trend,
    trendDirection = "up",
    trendSuffix = "dari 7 hari terakhir",
}: KpiCardProps) {
    return (
        <Card padding="md" className="flex items-center gap-3">
            <IconBox color={iconColor} size="lg">
                {icon}
            </IconBox>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                    {label}
                </p>
                <p className="text-base lg:text-lg font-bold text-buddy-text-main truncate">{value}</p>
                <TrendBadge value={trend} direction={trendDirection} suffix={trendSuffix} />
            </div>
        </Card>
    );
}
