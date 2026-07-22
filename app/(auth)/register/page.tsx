"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Divider } from "@/components/ui/Divider";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        businessName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
        general?: string;
    }>({});

    async function handleGoogleSignIn() {
        setLoading(true);
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch {
            setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const businessName = (form.elements.namedItem("businessName") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
        const terms = (form.elements.namedItem("terms") as HTMLInputElement).checked;

        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = "Nama tidak boleh kosong";
        if (!businessName.trim()) newErrors.businessName = "Nama bisnis tidak boleh kosong";
        if (!email) newErrors.email = "Email tidak boleh kosong";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Format email tidak valid";
        if (!password) newErrors.password = "Password tidak boleh kosong";
        else if (password.length < 8) newErrors.password = "Password minimal 8 karakter";
        if (!confirmPassword) newErrors.confirmPassword = "Konfirmasi password wajib diisi";
        else if (password !== confirmPassword) newErrors.confirmPassword = "Password tidak cocok";
        if (!terms) newErrors.terms = "Anda harus menyetujui syarat & ketentuan";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, businessName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    setErrors({ email: "Email sudah terdaftar" });
                } else {
                    setErrors({ general: data.error ?? "Registrasi gagal. Coba lagi." });
                }
                return;
            }

            const loginResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (loginResult?.error) {
                router.push("/login");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard className="max-w-[460px]">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main tracking-tight mb-2">
                    Buat Akun Baru 🚀
                </h1>
                <p className="text-sm text-buddy-text-muted">
                    Mulai kelola bisnis Anda lebih cerdas hari ini
                </p>
            </div>

            {errors.general && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input id="name" name="name" type="text" label="Nama Lengkap" placeholder="Budi Santoso" autoComplete="name" error={errors.name} />
                <Input id="businessName" name="businessName" type="text" label="Nama Bisnis" placeholder="Toko Budi, Warung Makan, dll" error={errors.businessName} />
                <Input id="email" name="email" type="email" label="Email" placeholder="nama@bisnis.com" autoComplete="email" error={errors.email} />
                <Input id="password" name="password" type="password" label="Password" placeholder="Minimal 8 karakter" autoComplete="new-password" error={errors.password} hint="Gunakan kombinasi huruf, angka, dan simbol" />
                <Input id="confirmPassword" name="confirmPassword" type="password" label="Konfirmasi Password" placeholder="Ulangi password Anda" autoComplete="new-password" error={errors.confirmPassword} />

                <div className="flex flex-col gap-1">
                    <Checkbox
                        id="terms"
                        name="terms"
                        label={
                            <span>
                                Saya setuju dengan{" "}
                                <Link href="#" className="text-buddy-purple font-semibold hover:underline underline-offset-2">Syarat & Ketentuan</Link>
                                {" "}dan{" "}
                                <Link href="#" className="text-buddy-purple font-semibold hover:underline underline-offset-2">Kebijakan Privasi</Link>
                            </span>
                        }
                    />
                    {errors.terms && <p className="text-xs text-buddy-error font-medium ml-6">{errors.terms}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
                    {loading ? "Membuat Akun..." : "Buat Akun"}
                </Button>
            </form>

            <Divider label="atau" className="my-6" />

            <Button 
                variant="google" 
                size="lg" 
                className="w-full gap-3" 
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </Button>

            <p className="text-center text-sm text-buddy-text-muted mt-6">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-buddy-purple font-semibold hover:underline underline-offset-2">Login sekarang</Link>
            </p>
        </AuthCard>
    );
}
