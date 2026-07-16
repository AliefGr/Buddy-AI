import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-3xl border border-buddy-border shadow-[0_4px_32px_rgba(0,0,0,0.06)] p-8 w-full",
                className
            )}
        >
            {children}
        </div>
    );
}
