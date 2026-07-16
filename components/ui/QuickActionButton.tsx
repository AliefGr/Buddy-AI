"use client";

import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
    icon: React.ReactNode;
    label: string;
    iconColor: "purple" | "blue" | "green" | "amber";
}

const colorMap: Record<string, { idle: string; hover: string }> = {
    purple: {
        idle: "bg-purple-50 text-buddy-purple",
        hover: "group-hover:bg-buddy-purple group-hover:text-white",
    },
    blue: {
        idle: "bg-blue-50 text-blue-500",
        hover: "group-hover:bg-blue-500 group-hover:text-white",
    },
    green: {
        idle: "bg-green-50 text-green-500",
        hover: "group-hover:bg-green-500 group-hover:text-white",
    },
    amber: {
        idle: "bg-amber-50 text-amber-500",
        hover: "group-hover:bg-amber-500 group-hover:text-white",
    },
};

export function QuickActionButton({ icon, label, iconColor }: QuickActionButtonProps) {
    const colors = colorMap[iconColor];

    return (
        <button className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex items-center gap-3 hover:border-buddy-purple transition-all group">
            <div
                className={cn(
                    "p-2 rounded-xl transition-colors",
                    colors.idle,
                    colors.hover
                )}
            >
                {icon}
            </div>
            <span className="text-sm font-bold text-buddy-text-main">{label}</span>
        </button>
    );
}
