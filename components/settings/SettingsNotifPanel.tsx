"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface NotificationSettings {
  emailNotification?: boolean;
  whatsappNotification?: boolean;
  aiInsight?: boolean;
  lowStock?: boolean;
  dailyBrief?: boolean;
  marketingReminder?: boolean;
  weeklyReport?: boolean;
  monthlyReport?: boolean;
  campaignReminder?: boolean;
  broadcastReminder?: boolean;
}

export function SettingsNotifPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotification: true,
    whatsappNotification: true,
    aiInsight: true,
    lowStock: true,
    dailyBrief: true,
    marketingReminder: false,
    weeklyReport: false,
    monthlyReport: false,
    campaignReminder: false,
    broadcastReminder: false,
  });

  useEffect(() => {
    // First check if user has notification settings via /api/user/me or similar
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.notificationSettings) {
          setSettings(data.notificationSettings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/notification-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  function toggle(key: keyof NotificationSettings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12 gap-2 text-buddy-text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat pengaturan...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-bold text-buddy-text-main mb-6">Preferensi Notifikasi</h2>
      <div className="space-y-4 mb-6">
        {[
          { key: "emailNotification", label: "Email Notification", desc: "Terima notifikasi via email" },
          { key: "whatsappNotification", label: "WhatsApp Notification", desc: "Terima notifikasi via WhatsApp" },
          { key: "aiInsight", label: "AI Insight", desc: "Notifikasi ketika AI insight baru tersedia" },
          { key: "lowStock", label: "Low Stock", desc: "Notifikasi ketika stok barang hampir habis" },
          { key: "dailyBrief", label: "Daily Brief", desc: "Ringkasan harian performa bisnis" },
          { key: "marketingReminder", label: "Marketing Reminder", desc: "Pengingat untuk kegiatan marketing" },
          { key: "weeklyReport", label: "Weekly Report", desc: "Ringkasan mingguan performa bisnis" },
          { key: "monthlyReport", label: "Monthly Report", desc: "Ringkasan bulanan performa bisnis" },
          { key: "campaignReminder", label: "Campaign Reminder", desc: "Pengingat tentang campaign yang berjalan" },
          { key: "broadcastReminder", label: "Broadcast Reminder", desc: "Pengingat tentang broadcast yang berjalan" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-semibold text-buddy-text-main">{item.label}</p>
              <p className="text-xs text-buddy-text-muted">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(item.key as keyof NotificationSettings)}
              className={`relative w-11 h-6 rounded-full transition-all ${
                settings[item.key as keyof NotificationSettings] ? "bg-buddy-purple" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  settings[item.key as keyof NotificationSettings] ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          loading={saving}
          onClick={handleSave}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? "Tersimpan ✓" : saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </Card>
  );
}
