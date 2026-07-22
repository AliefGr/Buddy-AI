"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  MessageSquare,
  Mail,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface StoreData {
  waBusinessPhoneId?: string | null;
  waBusinessAccountId?: string | null;
  waBusinessApiKey?: string | null;
  waBusinessVerifyToken?: string | null;
  waBusinessWebhookUrl?: string | null;
  emailSmtpHost?: string | null;
  emailSmtpPort?: number | null;
  emailSmtpUser?: string | null;
  emailSmtpPassword?: string | null;
  emailEncryption?: string | null;
  emailSenderName?: string | null;
  emailSenderEmail?: string | null;
  instagramAccessToken?: string | null;
  instagramBusinessAccount?: string | null;
  facebookPageId?: string | null;
  facebookAccessToken?: string | null;
}

export function SettingsIntegrasiPanel() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [waBusinessPhoneId, setWaBusinessPhoneId] = useState("");
  const [waBusinessAccountId, setWaBusinessAccountId] = useState("");
  const [waBusinessApiKey, setWaBusinessApiKey] = useState("");
  const [waBusinessVerifyToken, setWaBusinessVerifyToken] = useState("");
  const [waBusinessWebhookUrl, setWaBusinessWebhookUrl] = useState("");

  const [emailSmtpHost, setEmailSmtpHost] = useState("");
  const [emailSmtpPort, setEmailSmtpPort] = useState("");
  const [emailSmtpUser, setEmailSmtpUser] = useState("");
  const [emailSmtpPassword, setEmailSmtpPassword] = useState("");
  const [emailEncryption, setEmailEncryption] = useState("");
  const [emailSenderName, setEmailSenderName] = useState("");
  const [emailSenderEmail, setEmailSenderEmail] = useState("");

  const [instagramAccessToken, setInstagramAccessToken] = useState("");
  const [instagramBusinessAccount, setInstagramBusinessAccount] = useState("");

  const [facebookPageId, setFacebookPageId] = useState("");
  const [facebookAccessToken, setFacebookAccessToken] = useState("");

  useEffect(() => {
    fetch("/api/store")
      .then((r) => r.json())
      .then((data) => {
        setStore(data);
        setWaBusinessPhoneId(data.waBusinessPhoneId || "");
        setWaBusinessAccountId(data.waBusinessAccountId || "");
        setWaBusinessApiKey(data.waBusinessApiKey || "");
        setWaBusinessVerifyToken(data.waBusinessVerifyToken || "");
        setWaBusinessWebhookUrl(data.waBusinessWebhookUrl || "");

        setEmailSmtpHost(data.emailSmtpHost || "");
        setEmailSmtpPort(data.emailSmtpPort?.toString() || "");
        setEmailSmtpUser(data.emailSmtpUser || "");
        setEmailSmtpPassword(data.emailSmtpPassword || "");
        setEmailEncryption(data.emailEncryption || "");
        setEmailSenderName(data.emailSenderName || "");
        setEmailSenderEmail(data.emailSenderEmail || "");

        setInstagramAccessToken(data.instagramAccessToken || "");
        setInstagramBusinessAccount(data.instagramBusinessAccount || "");

        setFacebookPageId(data.facebookPageId || "");
        setFacebookAccessToken(data.facebookAccessToken || "");

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waBusinessPhoneId: waBusinessPhoneId || null,
          waBusinessAccountId: waBusinessAccountId || null,
          waBusinessApiKey: waBusinessApiKey || null,
          waBusinessVerifyToken: waBusinessVerifyToken || null,
          waBusinessWebhookUrl: waBusinessWebhookUrl || null,

          emailSmtpHost: emailSmtpHost || null,
          emailSmtpPort: emailSmtpPort ? parseInt(emailSmtpPort) : null,
          emailSmtpUser: emailSmtpUser || null,
          emailSmtpPassword: emailSmtpPassword || null,
          emailEncryption: emailEncryption || null,
          emailSenderName: emailSenderName || null,
          emailSenderEmail: emailSenderEmail || null,

          instagramAccessToken: instagramAccessToken || null,
          instagramBusinessAccount: instagramBusinessAccount || null,

          facebookPageId: facebookPageId || null,
          facebookAccessToken: facebookAccessToken || null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12 gap-2 text-buddy-text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat integrasi...</span>
        </div>
      </Card>
    );
  }

  const isWaConnected = waBusinessPhoneId && waBusinessApiKey;
  const isEmailConnected =
    emailSmtpHost && emailSmtpPort && emailSmtpUser && emailSmtpPassword;
  const isIgConnected = instagramAccessToken;
  const isFbConnected = facebookPageId && facebookAccessToken;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-buddy-text-main">Integrasi</h2>
        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          className="text-sm text-buddy-purple hover:text-buddy-purple/80 flex items-center gap-1"
        >
          {showPasswords ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {showPasswords ? "Sembunyikan" : "Tampilkan"} Token
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* WhatsApp Business */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-buddy-text-main">
                WhatsApp Business
              </h3>
              <p className="text-xs text-buddy-text-muted">
                Kirim pesan ke pelanggan via WA Business
              </p>
            </div>
            {isWaConnected && (
              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Phone Number ID
              </label>
              <input
                type="text"
                value={waBusinessPhoneId}
                onChange={(e) => setWaBusinessPhoneId(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="1234567890123456789"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Business Account ID
              </label>
              <input
                type="text"
                value={waBusinessAccountId}
                onChange={(e) => setWaBusinessAccountId(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="9876543210987654321"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Access Token
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={waBusinessApiKey}
                onChange={(e) => setWaBusinessApiKey(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="EAA..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Verify Token
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={waBusinessVerifyToken}
                onChange={(e) => setWaBusinessVerifyToken(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="your-verify-token"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Webhook URL
              </label>
              <input
                type="url"
                value={waBusinessWebhookUrl}
                onChange={(e) => setWaBusinessWebhookUrl(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="https://example.com/webhook"
              />
            </div>
          </div>
        </div>

        {/* Email (SMTP) */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-buddy-text-main">
                Email (SMTP)
              </h3>
              <p className="text-xs text-buddy-text-muted">
                Kirim email notifikasi dan newsletter
              </p>
            </div>
            {isEmailConnected && (
              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                SMTP Host
              </label>
              <input
                type="text"
                value={emailSmtpHost}
                onChange={(e) => setEmailSmtpHost(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                SMTP Port
              </label>
              <input
                type="number"
                value={emailSmtpPort}
                onChange={(e) => setEmailSmtpPort(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="587"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Username/Email
              </label>
              <input
                type="text"
                value={emailSmtpUser}
                onChange={(e) => setEmailSmtpUser(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={emailSmtpPassword}
                onChange={(e) => setEmailSmtpPassword(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Encryption
              </label>
              <select
                value={emailEncryption}
                onChange={(e) => setEmailEncryption(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              >
                <option value="">Pilih Encryption</option>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Sender Name
              </label>
              <input
                type="text"
                value={emailSenderName}
                onChange={(e) => setEmailSenderName(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="Nama Bisnis Anda"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Sender Email
              </label>
              <input
                type="email"
                value={emailSenderEmail}
                onChange={(e) => setEmailSenderEmail(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="noreply@yourdomain.com"
              />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <span className="w-5 h-5 flex items-center justify-center text-pink-600 text-sm font-bold">
                IG
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-buddy-text-main">Instagram</h3>
              <p className="text-xs text-buddy-text-muted">
                Hubungkan Instagram untuk posting otomatis
              </p>
            </div>
            {isIgConnected && (
              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Business Account ID
              </label>
              <input
                type="text"
                value={instagramBusinessAccount}
                onChange={(e) => setInstagramBusinessAccount(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Access Token
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={instagramAccessToken}
                onChange={(e) => setInstagramAccessToken(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="IGQVJ..."
              />
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="w-5 h-5 flex items-center justify-center text-blue-600 text-sm font-bold">
                FB
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-buddy-text-main">Facebook</h3>
              <p className="text-xs text-buddy-text-muted">
                Hubungkan Facebook untuk posting otomatis
              </p>
            </div>
            {isFbConnected && (
              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Page ID
              </label>
              <input
                type="text"
                value={facebookPageId}
                onChange={(e) => setFacebookPageId(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
                Access Token
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={facebookAccessToken}
                onChange={(e) => setFacebookAccessToken(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                placeholder="EAA..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saved
              ? "Tersimpan ✓"
              : saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
