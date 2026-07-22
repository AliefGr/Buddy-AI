"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SettingsSecurityPanel() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPwd !== confirmPwd) {
      setMessage({ type: "error", text: "Password baru dan konfirmasi tidak cocok" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Password berhasil diubah" });
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setTimeout(() => setMessage(null), 5000);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Gagal mengubah password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="font-bold text-buddy-text-main mb-6">Keamanan Akun</h2>

      {/* Change Password */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-buddy-purple" />
          <h3 className="font-semibold text-buddy-text-main text-sm">Ubah Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Password Saat Ini
            </label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="••••••••"
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="••••••••"
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="••••••••"
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" loading={loading} className="gap-2">
              <Save className="w-3.5 h-3.5" />
              {loading ? "Menyimpan..." : "Ubah Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* 2FA */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-4 h-4 text-buddy-purple" />
          <h3 className="font-semibold text-buddy-text-main text-sm">Autentikasi 2 Faktor</h3>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
          <div>
            <p className="text-sm font-semibold text-buddy-text-main">Two-Factor Authentication</p>
            <p className="text-xs text-buddy-text-muted mt-0.5">
              {twoFAEnabled ? "2FA aktif — akun Anda lebih aman" : "Aktifkan untuk keamanan tambahan"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {twoFAEnabled && (
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] font-bold text-green-600">Aktif</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setTwoFAEnabled((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-all ${
                twoFAEnabled ? "bg-buddy-purple" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  twoFAEnabled ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
