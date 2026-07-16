"use client";

import { useState, useEffect } from "react";
import { Send, Users, CheckCheck, Clock, Sparkles, Plus, MessageSquare, Mail, Phone, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Broadcast {
    id: string;
    title: string;
    channel: "WHATSAPP" | "EMAIL" | "SMS";
    status: "DRAFT" | "SCHEDULED" | "SENT";
    content: string;
    recipients: number;
    readCount: number;
    failedCount: number;
    scheduledAt: string | null;
    sentAt: string | null;
    createdAt: string;
}

const statusMap = {
    SENT: { label: "Terkirim", color: "bg-green-100 text-green-700" },
    SCHEDULED: { label: "Terjadwal", color: "bg-amber-100 text-amber-700" },
    DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600" },
};

const channelIcon = {
    WHATSAPP: <MessageSquare className="w-3.5 h-3.5" />,
    EMAIL: <Mail className="w-3.5 h-3.5" />,
    SMS: <Phone className="w-3.5 h-3.5" />,
};

const templates = [
    { emoji: "🔥", title: "Flash Sale", desc: "Template promo terbatas", content: "Hai! Ada promo spesial hari ini. Jangan sampai ketinggalan! 🎉" },
    { emoji: "👋", title: "Welcome", desc: "Sambut pelanggan baru", content: "Selamat datang! Kami senang Anda bergabung. Nikmati promo spesial untuk pembelian pertama Anda 🎁" },
    { emoji: "🎁", title: "Member Reward", desc: "Apresiasi pelanggan setia", content: "Terima kasih sudah setia bersama kami! Ada reward spesial menanti Anda 🌟" },
    { emoji: "📦", title: "Restock Info", desc: "Info produk baru/restock", content: "Kabar gembira! Produk favorit Anda sudah tersedia kembali. Buruan sebelum habis! 📦" },
];

function AddBroadcastModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");

    async function generateWithAI() {
        if (!aiPrompt.trim()) return;
        setAiLoading(true);
        try {
            const res = await fetch("/api/ai/marketing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "promo", platform: "whatsapp", productName: aiPrompt }),
            });
            const data = await res.json();
            if (res.ok) setContent(data.content);
        } finally { setAiLoading(false); }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            title: (form.elements.namedItem("title") as HTMLInputElement).value,
            channel: (form.elements.namedItem("channel") as HTMLSelectElement).value,
            content,
            scheduledAt: (form.elements.namedItem("scheduledAt") as HTMLInputElement).value || undefined,
        };
        if (!data.content.trim()) { setError("Isi pesan tidak boleh kosong"); return; }
        setLoading(true); setError("");
        try {
            const res = await fetch("/api/broadcasts", {
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
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="font-bold text-buddy-text-main">Buat Broadcast</h2>
                    <button onClick={onClose}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Judul *</label>
                        <input name="title" required className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="Flash Sale Weekend" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Channel *</label>
                        <select name="channel" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple">
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="EMAIL">Email</option>
                            <option value="SMS">SMS</option>
                        </select>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-buddy-text-muted">Isi Pesan *</label>
                            <span className="text-[10px] text-buddy-text-subtle">atau gunakan template di bawah</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={4}
                            className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple resize-none"
                            placeholder="Tulis pesan broadcast..."
                        />
                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                            {templates.map((t, idx) => (
                                <button key={idx} type="button" onClick={() => setContent(t.content)}
                                    className="text-left bg-gray-50 hover:bg-buddy-purple/5 border border-gray-100 hover:border-buddy-purple rounded-xl p-2.5 transition-all">
                                    <span className="text-sm">{t.emoji}</span>
                                    <p className="text-[11px] font-semibold text-buddy-text-main">{t.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-buddy-purple/5 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-buddy-purple mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Generate dengan AI
                        </p>
                        <div className="flex gap-2">
                            <input
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                                placeholder="Deskripsikan pesan yang ingin dikirim..."
                                className="flex-1 border border-buddy-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-buddy-purple bg-white"
                            />
                            <Button type="button" variant="primary" size="sm" loading={aiLoading} onClick={generateWithAI} className="shrink-0">
                                {aiLoading ? "..." : "Generate"}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">Jadwal Kirim (opsional)</label>
                        <input name="scheduledAt" type="datetime-local" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" />
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

export default function BroadcastPage() {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"Semua" | Broadcast["status"]>("Semua");
    const [showAdd, setShowAdd] = useState(false);

    async function fetchBroadcasts() {
        setLoading(true);
        try {
            const res = await fetch("/api/broadcasts");
            if (res.ok) setBroadcasts(await res.json());
        } finally { setLoading(false); }
    }

    useEffect(() => { fetchBroadcasts(); }, []);

    async function markSent(id: string) {
        const totalCustomers = 100;
        await fetch(`/api/broadcasts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "SENT", recipients: totalCustomers }),
        });
        fetchBroadcasts();
    }

    const filtered = filter === "Semua" ? broadcasts : broadcasts.filter(b => b.status === filter);
    const sent = broadcasts.filter(b => b.status === "SENT");
    const totalRecipients = sent.reduce((s, b) => s + b.recipients, 0);
    const totalRead = sent.reduce((s, b) => s + b.readCount, 0);
    const readRate = totalRecipients > 0 ? Math.round((totalRead / totalRecipients) * 100) : 0;
    const scheduled = broadcasts.filter(b => b.status === "SCHEDULED").length;

    const stats = [
        { label: "Pesan Terkirim", value: sent.length.toString(), icon: <Send className="w-5 h-5" />, color: "bg-buddy-purple/10 text-buddy-purple" },
        { label: "Total Penerima", value: totalRecipients.toLocaleString("id-ID"), icon: <Users className="w-5 h-5" />, color: "bg-blue-100 text-blue-600" },
        { label: "Read Rate", value: `${readRate}%`, icon: <CheckCheck className="w-5 h-5" />, color: "bg-green-100 text-green-600" },
        { label: "Terjadwal", value: scheduled.toString(), icon: <Clock className="w-5 h-5" />, color: "bg-amber-100 text-amber-600" },
    ];

    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-buddy-text-main">Broadcast</h1>
                    <p className="text-sm text-buddy-text-muted">Kirim pesan massal ke pelanggan</p>
                </div>
                <Button variant="primary" size="sm" className="gap-2 self-start sm:self-auto" onClick={() => setShowAdd(true)}>
                    <Plus className="w-4 h-4" /> Buat Broadcast
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
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex gap-1 bg-white border border-buddy-border rounded-xl p-1 overflow-x-auto">
                        {(["Semua", "SENT", "SCHEDULED", "DRAFT"] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex-1 sm:flex-none ${filter === f ? "bg-buddy-purple text-white shadow-sm" : "text-buddy-text-muted hover:text-buddy-text-main"}`}>
                                {f === "Semua" ? "Semua" : statusMap[f].label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12 gap-2 text-buddy-text-muted">
                            <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Memuat...</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-buddy-text-muted">
                            <Send className="w-8 h-8 opacity-30" />
                            <p className="text-sm font-medium">Belum ada broadcast</p>
                            <Button variant="primary" size="sm" className="mt-2 gap-1.5" onClick={() => setShowAdd(true)}>
                                <Plus className="w-3.5 h-3.5" /> Buat Broadcast
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(b => {
                                const s = statusMap[b.status];
                                return (
                                    <Card key={b.id} padding="md">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-buddy-purple/5 rounded-xl flex items-center justify-center text-buddy-purple shrink-0">
                                                {channelIcon[b.channel]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="font-semibold text-buddy-text-main text-sm">{b.title}</p>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                                                </div>
                                                <p className="text-xs text-buddy-text-subtle truncate mb-2">{b.content}</p>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="text-[11px] text-buddy-text-muted flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {b.recipients > 0 ? `${b.recipients.toLocaleString()} penerima` : "Belum dikirim"}
                                                    </span>
                                                    {b.readCount > 0 && (
                                                        <span className="text-[11px] text-green-600 flex items-center gap-1 font-semibold">
                                                            <CheckCheck className="w-3 h-3" />
                                                            {b.readCount} dibaca
                                                        </span>
                                                    )}
                                                    {b.scheduledAt && (
                                                        <span className="text-[11px] text-buddy-text-subtle flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(b.scheduledAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {b.status === "DRAFT" && (
                                                <Button variant="secondary" size="sm" className="shrink-0" onClick={() => markSent(b.id)}>
                                                    Kirim
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-buddy-purple" />
                            </div>
                            <div>
                                <p className="font-bold text-buddy-text-main text-sm">AI Broadcast Writer</p>
                                <p className="text-[10px] text-buddy-text-subtle">Generate pesan otomatis dengan AI</p>
                            </div>
                        </div>
                        <p className="text-xs text-buddy-text-muted leading-relaxed mb-4">
                            Klik "Buat Broadcast" dan gunakan fitur AI untuk generate pesan yang tepat sasaran.
                        </p>
                        <Button variant="primary" size="sm" className="w-full justify-center gap-2" onClick={() => setShowAdd(true)}>
                            <Plus className="w-3.5 h-3.5" />
                            Buat dengan AI
                        </Button>
                    </Card>
                </div>
            </div>

            {showAdd && (
                <AddBroadcastModal
                    onClose={() => setShowAdd(false)}
                    onSuccess={() => { setShowAdd(false); fetchBroadcasts(); }}
                />
            )}
        </>
    );
}
