import { cn } from "@/lib/utils";

interface IconBoxProps {
    children: React.ReactNode;
    color?: "purple" | "blue" | "green" | "orange" | "amber" | "red" | "gray";
    size?: "sm" | "md" | "lg";
    className?: string;
}

const colorMap: Record<string, string> = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
    gray: "bg-gray-100 text-gray-500",
};

const sizeMap: Record<string, string> = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
};

export function IconBox({
    children,
    color = "purple",
    size = "md",
    className,
}: IconBoxProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center shrink-0",
                colorMap[color],
                sizeMap[size],
                className
            )}
        >
            {children}
        </div>
    );
}
