"use client";

import { useState, useEffect } from "react";
import { Save, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface StoreData {
    id: string;
    name: string;
    currency: string;
    timezone: string;
}

const timezones = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"];
const currencies = ["IDR", "USD"];

export function SettingsBisnisForm() {
    const [store, setStore] = useState<StoreData | null>(null);
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("IDR");
    const [timezone, setTimezone] = useState("Asia/Jakarta");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/store")
            .then(r => r.json())
            .then(data => {
                setStore(data);
                setName(data.name ?? "");
                setCurrency(data.currency ?? "IDR");
                setTimezone(data.timezone ?? "Asia/Jakarta");
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
                body: JSON.stringify({ name, currency, timezone }),
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
                    <span className="text-sm">Memuat data bisnis...</span>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="font-bold text-buddy-text-main mb-6">Informasi Bisnis</h2>
            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">Nama Toko</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">Mata Uang</label>
                    <div className="relative">
                        <select
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm appearance-none pr-9 focus:outline-none"
                        >
                            {currencies.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">Zona Waktu</label>
                    <div className="relative">
                        <select
                            value={timezone}
                            onChange={e => setTimezone(e.target.value)}
                            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm appearance-none pr-9 focus:outline-none"
                        >
                            {timezones.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle pointer-events-none" />
                    </div>
                </div>
                <div className="pt-2 flex items-center justify-between">
                    <p className="text-[10px] text-buddy-text-subtle">Store ID: {store?.id?.slice(0, 8)}...</p>
                    <Button type="submit" variant="primary" size="md" loading={saving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saved ? "Tersimpan ✓" : saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
