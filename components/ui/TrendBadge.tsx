import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendBadgeProps {
    value: string;
    direction?: "up" | "down";
    suffix?: string;
    className?: string;
}

export function TrendBadge({
    value,
    direction = "up",
    suffix,
    className,
}: TrendBadgeProps) {
    const isUp = direction === "up";

    return (
        <span
            className={cn(
                "text-[10px] font-semibold flex items-center gap-0.5",
                isUp ? "text-green-500" : "text-red-500",
                className
            )}
        >
            {isUp ? (
                <ArrowUpRight className="w-3 h-3" />
            ) : (
                <ArrowDownRight className="w-3 h-3" />
            )}
            {value}
            {suffix && <span className="text-gray-400 font-normal ml-1">{suffix}</span>}
        </span>
    );
}
