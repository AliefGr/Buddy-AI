"use client";

import { useState, useEffect } from "react";
import { Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    store?: { name: string } | null;
}

export function SettingsProfileForm() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(data => {
                setProfile(data);
                setName(data.name ?? "");
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
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
                    <span className="text-sm">Memuat profil...</span>
                </div>
            </Card>
        );
    }

    const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

    return (
        <Card>
            <h2 className="font-bold text-buddy-text-main mb-6">Profil Saya</h2>
            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                <div className="relative">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden bg-buddy-purple/10 border-2 border-white shadow-md flex items-center justify-center">
                        {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-buddy-purple">{initials}</span>
                        )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-buddy-purple rounded-xl flex items-center justify-center shadow-md">
                        <Camera className="w-3.5 h-3.5 text-white" />
                    </button>
                </div>
                <div>
                    <p className="font-bold text-buddy-text-main">{name}</p>
                    <p className="text-xs text-buddy-text-muted">{profile?.role ?? "Pemilik"} · {profile?.store?.name ?? "—"}</p>
                </div>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">Nama Lengkap</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">Email</label>
                    <input
                        type="email"
                        value={profile?.email ?? ""}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-buddy-text-muted cursor-not-allowed"
                    />
                    <p className="text-[10px] text-buddy-text-subtle mt-1">Email tidak dapat diubah</p>
                </div>
                <div>
                    <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">Peran</label>
                    <input
                        type="text"
                        value={profile?.role ?? "OWNER"}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-buddy-text-muted cursor-not-allowed"
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" size="md" loading={saving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saved ? "Tersimpan ✓" : saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
