import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "sm" | "md" | "lg" | "none";
    overflow?: boolean;
}

const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
};

export function Card({
    children,
    className,
    padding = "lg",
    overflow = false,
}: CardProps) {
    return (
        <div
            className={cn(
                "bg-buddy-card rounded-3xl border border-gray-100 shadow-sm",
                paddingMap[padding],
                overflow ? "overflow-hidden" : "",
                className
            )}
        >
            {children}
        </div>
    );
}
