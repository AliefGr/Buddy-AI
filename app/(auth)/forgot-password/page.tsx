"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        general?: string;
    }>({});

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;

        const newErrors: typeof errors = {};
        if (!email) newErrors.email = "Email tidak boleh kosong";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Format email tidak valid";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            // Always show success message even if email doesn't exist
            setEmailSent(true);
        } catch {
            setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
        } finally {
            setLoading(false);
        }
    }

    if (emailSent) {
        return (
            <AuthCard className="max-w-[460px]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-buddy-text-main tracking-tight mb-2">
                        Cek Email Anda ✉️
                    </h1>
                    <p className="text-sm text-buddy-text-muted">
                        Jika email terdaftar, kami telah mengirimkan link reset password.
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push("/login")}
                >
                    Kembali ke Login
                </Button>
            </AuthCard>
        );
    }

    return (
        <AuthCard className="max-w-[460px]">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main tracking-tight mb-2">
                    Lupa Password? 🔐
                </h1>
                <p className="text-sm text-buddy-text-muted">
                    Masukkan email Anda dan kami akan mengirimkan link reset password.
                </p>
            </div>

            {errors.general && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="nama@bisnis.com"
                    autoComplete="email"
                    error={errors.email}
                />
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full mt-2"
                >
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>
            </form>

            <p className="text-center text-sm text-buddy-text-muted mt-6">
                Ingat password?{" "}
                <Link
                    href="/login"
                    className="text-buddy-purple font-semibold hover:underline underline-offset-2"
                >
                    Login sekarang
                </Link>
            </p>
        </AuthCard>
    );
}
