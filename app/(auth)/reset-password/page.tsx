"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [passwordReset, setPasswordReset] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (!token) {
      setValidToken(false);
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    const newErrors: typeof errors = {};
    if (!password) newErrors.password = "Password tidak boleh kosong";
    else if (password.length < 8)
      newErrors.password = "Password minimal 8 karakter";
    if (!confirmPassword)
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Password tidak cocok";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 400) {
          setValidToken(false);
        } else {
          setErrors({
            general: data.error ?? "Reset password gagal. Coba lagi.",
          });
        }
        return;
      }

      setPasswordReset(true);
    } catch {
      setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  if (!validToken) {
    return (
      <AuthCard className="max-w-[460px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-buddy-text-main tracking-tight mb-2">
            Link Tidak Valid ⚠️
          </h1>
          <p className="text-sm text-buddy-text-muted">
            Link reset password sudah kadaluarsa atau tidak valid.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => router.push("/forgot-password")}
        >
          Kirim Link Baru
        </Button>
      </AuthCard>
    );
  }

  if (passwordReset) {
    return (
      <AuthCard className="max-w-[460px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-buddy-text-main tracking-tight mb-2">
            Password Diperbarui ✅
          </h1>
          <p className="text-sm text-buddy-text-muted">
            Password Anda berhasil diperbarui. Silakan login dengan password
            baru Anda.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Login Sekarang
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard className="max-w-[460px]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-buddy-text-main tracking-tight mb-2">
          Atur Ulang Password 🔑
        </h1>
        <p className="text-sm text-buddy-text-muted">
          Masukkan password baru Anda.
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="password"
          name="password"
          type="password"
          label="Password Baru"
          placeholder="Minimal 8 karakter"
          autoComplete="new-password"
          error={errors.password}
          hint="Gunakan kombinasi huruf, angka, dan simbol"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Konfirmasi Password Baru"
          placeholder="Ulangi password baru Anda"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          {loading ? "Memperbarui..." : "Atur Ulang Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
