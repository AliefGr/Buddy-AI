"use client";

import { useState, useEffect } from "react";
import { Target, Plus, Sparkles, TrendingUp, Eye, MousePointer, ArrowRight, Play, Pause, CheckCircle, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Campaign {
    id: string;
    name: string;
    platform: string;
    status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
    reach: number | null;
    clicks: number | null;
    budget: number | null;
    startDate: string | null;
    endDate: string | null;
    emoji: string | null;
    createdAt: string;
}

const statusMap = {
    ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-700" },
    DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600" },
    PAUSED: { label: "Dijeda", color: "bg-amber-100 text-amber-700" },
    COMPLETED: { label: "Selesai", color: "bg-blue-100 text-blue-700" },
};

function formatRupiah(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n}`;
}

function AddCampaignModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            platform: (form.elements.namedItem("platform") as HTMLSelectElement).value,
            budget: parseInt((form.elements.namedItem("budget") as HTMLInputElement).value) || undefined,
            emoji: (form.elements.namedItem("emoji") as HTMLInputElement).value || "📢",
        };
        setLoading(true); setError("");
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) { setError(json.error ?? "Gagal"); return; }
            onSuccess();
        } catch { setError("Terjadi kesalahan"); }
        finally { setLoading(false); }
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="font-bold text-buddy-text-main">Buat Campaign</h2>
                    <button onClick={onClose}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Nama Campaign *</label>
                        <input name="name" required className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="Flash Sale Weekend" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Platform *</label>
                            <select name="platform" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple">
                                {["Instagram", "WhatsApp", "TikTok", "Email"].map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Emoji</label>
                            <input name="emoji" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="📢" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Budget (Rp)</label>
                        <input name="budget" type="number" min="0" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="500000" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onClose}>Batal</Button>
                        <Button type="submit" variant="primary" size="sm" className="flex-1" loading={loading}>Simpan</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const aiSuggestions = [
    { title: "Flash Sale Selasa", desc: "Engagement rendah di weekday — coba flash sale 13.00–15.00.", tag: "Peluang" },
    { title: "Retargeting Pelanggan Lama", desc: "Pelanggan tidak beli >2 minggu. Cocok untuk re-engagement.", tag: "Re-engage" },
    { title: "Campaign Akhir Bulan", desc: "Manfaatkan momen gajian untuk boost penjualan.", tag: "Rencanakan" },
];

export default function CampaignPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"Semua" | Campaign["status"]>("Semua");
    const [showAdd, setShowAdd] = useState(false);

    async function fetchCampaigns() {
        setLoading(true);
        try {
            const res = await fetch("/api/campaigns");
            if (res.ok) setCampaigns(await res.json());
        } finally { setLoading(false); }
    }

    useEffect(() => { fetchCampaigns(); }, []);

    async function updateStatus(id: string, status: Campaign["status"]) {
        await fetch(`/api/campaigns/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchCampaigns();
    }

    const filtered = filter === "Semua" ? campaigns : campaigns.filter(c => c.status === filter);
    const active = campaigns.filter(c => c.status === "ACTIVE").length;
    const totalReach = campaigns.reduce((s, c) => s + (c.reach ?? 0), 0);
    const totalClicks = campaigns.reduce((s, c) => s + (c.clicks ?? 0), 0);
    const clickRate = totalReach > 0 ? ((totalClicks / totalReach) * 100).toFixed(1) : "0";

    const stats = [
        { label: "Campaign Aktif", value: active.toString(), icon: <Target className="w-5 h-5" />, color: "bg-buddy-purple/10 text-buddy-purple" },
        { label: "Total Reach", value: totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString(), icon: <Eye className="w-5 h-5" />, color: "bg-blue-100 text-blue-600" },
        { label: "Click Rate", value: `${clickRate}%`, icon: <MousePointer className="w-5 h-5" />, color: "bg-green-100 text-green-600" },
        { label: "Total Campaign", value: campaigns.length.toString(), icon: <TrendingUp className="w-5 h-5" />, color: "bg-amber-100 text-amber-600" },
    ];

    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-buddy-text-main">Campaign</h1>
                    <p className="text-sm text-buddy-text-muted">Kelola dan pantau semua campaign marketing Anda</p>
                </div>
                <Button variant="primary" size="sm" className="gap-2 self-start sm:self-auto" onClick={() => setShowAdd(true)}>
                    <Plus className="w-4 h-4" /> Buat Campaign
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {stats.map((s, idx) => (
                    <Card key={idx} padding="md">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                        <p className="text-xl font-bold text-buddy-text-main">{s.value}</p>
                        <p className="text-xs text-buddy-text-muted mt-1">{s.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-8">
                    <Card padding="none" overflow>
                        <div className="p-4 sm:p-6 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <h3 className="font-bold text-buddy-text-main flex-1">Semua Campaign</h3>
                                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                                    {(["Semua", "ACTIVE", "DRAFT", "PAUSED", "COMPLETED"] as const).map(f => (
                                        <button key={f} onClick={() => setFilter(f)}
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${filter === f ? "bg-white text-buddy-purple shadow-sm" : "text-buddy-text-muted hover:text-buddy-text-main"}`}>
                                            {f === "Semua" ? "Semua" : statusMap[f].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12 gap-2 text-buddy-text-muted">
                                <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Memuat...</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-buddy-text-muted">
                                <Target className="w-8 h-8 opacity-30" />
                                <p className="text-sm font-medium">Belum ada campaign</p>
                                <Button variant="primary" size="sm" className="mt-2 gap-1.5" onClick={() => setShowAdd(true)}>
                                    <Plus className="w-3.5 h-3.5" /> Buat Campaign Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            {["Campaign", "Status", "Reach", "Clicks", "Budget", "Aksi"].map(h => (
                                                <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider last:text-center">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(c => {
                                            const s = statusMap[c.status];
                                            return (
                                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-base shrink-0">{c.emoji ?? "📢"}</div>
                                                            <div>
                                                                <p className="font-semibold text-buddy-text-main">{c.name}</p>
                                                                <p className="text-[11px] text-buddy-text-subtle">{c.platform}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-buddy-text-main">{c.reach?.toLocaleString("id-ID") ?? "—"}</td>
                                                    <td className="px-6 py-4 font-semibold text-buddy-text-main">{c.clicks?.toLocaleString("id-ID") ?? "—"}</td>
                                                    <td className="px-6 py-4 text-buddy-text-muted text-xs">{c.budget ? formatRupiah(c.budget) : "—"}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        {c.status === "ACTIVE" ? (
                                                            <button onClick={() => updateStatus(c.id, "PAUSED")} className="p-1.5 rounded-lg hover:bg-gray-100 text-buddy-text-muted"><Pause className="w-4 h-4" /></button>
                                                        ) : c.status === "DRAFT" || c.status === "PAUSED" ? (
                                                            <button onClick={() => updateStatus(c.id, "ACTIVE")} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"><Play className="w-4 h-4" /></button>
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4 text-gray-300 mx-auto" />
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <Card className="h-full">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center"><Sparkles className="w-4 h-4 text-buddy-purple" /></div>
                            <div>
                                <p className="font-bold text-buddy-text-main text-sm">Ide Campaign AI</p>
                                <p className="text-[10px] text-buddy-text-subtle">Rekomendasi dari Buddy</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {aiSuggestions.map((s, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <span className="text-xs font-bold text-buddy-purple bg-buddy-purple/10 px-2 py-0.5 rounded-full">{s.tag}</span>
                                    <p className="text-sm font-semibold text-buddy-text-main mt-2 mb-1">{s.title}</p>
                                    <p className="text-xs text-buddy-text-muted leading-relaxed mb-3">{s.desc}</p>
                                    <button onClick={() => setShowAdd(true)} className="text-[10px] font-bold text-buddy-purple flex items-center gap-1 hover:underline">
                                        Buat Campaign <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {showAdd && (
                <AddCampaignModal
                    onClose={() => setShowAdd(false)}
                    onSuccess={() => { setShowAdd(false); fetchCampaigns(); }}
                />
            )}
        </>
    );
}
