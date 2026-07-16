import { cn } from "@/lib/utils";

interface ActivityItemProps {
    icon: React.ReactNode;
    iconColor: "blue" | "green" | "orange" | "purple" | "gray";
    label: string;
    time: string;
}

const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-500",
    gray: "bg-gray-50 text-gray-400",
};

export function ActivityItem({ icon, iconColor, label, time }: ActivityItemProps) {
    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", colorMap[iconColor])}>{icon}</div>
                <p className={cn("text-xs font-medium", iconColor === "gray" ? "text-gray-400" : "text-gray-800")}>
                    {label}
                </p>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{time}</span>
        </li>
    );
}
