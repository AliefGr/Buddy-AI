"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    onNavigate?: () => void;
}

export function NavItem({ href, icon, label, onNavigate }: NavItemProps) {
    const pathname = usePathname();

    const isActive =
        href === "/dashboard"
            ? pathname === "/dashboard"
            : href !== "#" && pathname.startsWith(href);

    return (
        <li>
            <Link
                href={href}
                onClick={href !== "#" ? onNavigate : undefined}
                className={cn(
                    "flex items-center gap-3 p-3 rounded-xl text-sm transition-colors",
                    isActive
                        ? "sidebar-active font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                )}
            >
                <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    {icon}
                </span>
                <span>{label}</span>
            </Link>
        </li>
    );
}
