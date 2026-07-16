import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type InsightVariant = "danger" | "warning" | "success" | "info";

interface InsightItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    variant: InsightVariant;
}

const variantMap: Record<InsightVariant, { wrapper: string; iconBox: string }> = {
    danger: {
        wrapper: "bg-red-50 border-red-100 hover:bg-red-100",
        iconBox: "text-red-500",
    },
    warning: {
        wrapper: "bg-amber-50 border-amber-100 hover:bg-amber-100",
        iconBox: "text-amber-500",
    },
    success: {
        wrapper: "bg-green-50 border-green-100 hover:bg-green-100",
        iconBox: "text-green-500",
    },
    info: {
        wrapper: "bg-blue-50 border-blue-100 hover:bg-blue-100",
        iconBox: "text-blue-500",
    },
};

export function InsightItem({ icon, title, description, variant }: InsightItemProps) {
    const styles = variantMap[variant];

    return (
        <div
            className={cn(
                "p-3 rounded-2xl flex items-center justify-between border cursor-pointer transition-colors",
                styles.wrapper
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn("bg-white p-2 rounded-xl shadow-sm", styles.iconBox)}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-800">{title}</p>
                    <p className="text-[10px] text-gray-500">{description}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
    );
}
