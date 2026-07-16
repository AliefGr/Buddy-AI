"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: React.ReactNode;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
    return (
        <label
            htmlFor={id}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
            <div className="relative flex items-center justify-center">
                <input
                    id={id}
                    type="checkbox"
                    className={cn(
                        "peer w-4 h-4 appearance-none border-2 border-buddy-border rounded bg-white",
                        "checked:bg-buddy-purple checked:border-buddy-purple",
                        "focus:outline-none focus:ring-2 focus:ring-buddy-purple/20",
                        "transition-all cursor-pointer",
                        className
                    )}
                    {...props}
                />
                {/* Checkmark */}
                <svg
                    className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 10 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M1 4l3 3 5-6" />
                </svg>
            </div>
            {label && (
                <span className="text-sm text-buddy-text-muted">{label}</span>
            )}
        </label>
    );
}
