import { cn } from "@/lib/utils";

type BadgeVariant = "live" | "purple" | "default";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    animated?: boolean;
}

export function Badge({
    children,
    variant = "default",
    className,
    animated = false,
}: BadgeProps) {
    const base =
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold";

    const variants: Record<BadgeVariant, string> = {
        live: "bg-green-100 text-green-600",
        purple: "bg-buddy-purple/10 text-buddy-purple",
        default: "bg-gray-100 text-gray-600",
    };

    return (
        <span className={cn(base, variants[variant], className)}>
            {animated && (
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            )}
            {children}
        </span>
    );
}
