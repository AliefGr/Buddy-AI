"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "google";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:pointer-events-none";

    const variants: Record<ButtonVariant, string> = {
        primary:
            "bg-buddy-purple text-white rounded-xl hover:bg-buddy-purple-dim focus:ring-buddy-purple/40 hover:shadow-lg hover:shadow-buddy-purple/25",
        secondary:
            "border border-buddy-purple text-buddy-purple rounded-xl hover:bg-buddy-purple hover:text-white focus:ring-buddy-purple/30",
        ghost:
            "bg-white border border-buddy-border rounded-xl hover:bg-gray-50 text-buddy-text-muted focus:ring-gray-200",
        icon: "bg-white border border-buddy-border rounded-xl hover:bg-gray-50 relative focus:ring-gray-200",
        google:
            "bg-white border border-buddy-border rounded-xl hover:bg-gray-50 text-buddy-text-main shadow-sm focus:ring-gray-200",
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
        md: "text-sm px-5 py-2.5 gap-2 h-11",
        lg: "text-sm px-6 py-3 gap-2.5 h-12",
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{typeof children === "string" ? children : "Loading..."}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
