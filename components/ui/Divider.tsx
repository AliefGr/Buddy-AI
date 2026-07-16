import { cn } from "@/lib/utils";

interface DividerProps {
    label?: string;
    className?: string;
}

export function Divider({ label, className }: DividerProps) {
    if (!label) {
        return <hr className={cn("border-buddy-border", className)} />;
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="flex-1 h-px bg-buddy-border" />
            <span className="text-xs text-buddy-text-subtle font-medium whitespace-nowrap">
                {label}
            </span>
            <div className="flex-1 h-px bg-buddy-border" />
        </div>
    );
}
