"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold text-buddy-text-main">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={cn(
                            "input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm text-buddy-text-main placeholder:text-buddy-text-subtle transition-all",
                            error && "error",
                            isPassword && "pr-11",
                            className
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-buddy-text-muted hover:text-buddy-text-main transition-colors"
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-buddy-error font-medium">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-xs text-buddy-text-subtle">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
