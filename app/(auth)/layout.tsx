import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-bg min-h-screen flex flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between px-8 py-5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-buddy-purple rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-buddy-text-main">
                        Buddy
                    </span>
                </Link>

                <div className="flex items-center gap-1 text-sm text-buddy-text-muted">
                    <span>🇮🇩</span>
                    <span className="font-medium ml-1">Bahasa Indonesia</span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-center gap-6 py-6 text-xs text-buddy-text-subtle">
                <Link href="#" className="hover:text-buddy-text-muted transition-colors">
                    Privacy Policy
                </Link>
                <span>·</span>
                <Link href="#" className="hover:text-buddy-text-muted transition-colors">
                    Terms of Service
                </Link>
            </footer>
        </div>
    );
}
