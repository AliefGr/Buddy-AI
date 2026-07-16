"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Zap, AlertCircle } from "lucide-react";
import { AiCommandBar } from "@/components/ai/AiCommandBar";
import { AiSuggestionChips } from "@/components/ai/AiSuggestionChips";
import { AiConversation } from "@/components/ai/AiConversation";
import type { Message } from "@/components/ai/AiConversation";

const now = () =>
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const WELCOME: Message = {
    id: "welcome",
    role: "ai",
    content:
        "Halo! Saya **Buddy AI** 👋\n\nSaya sudah terhubung dengan data bisnis Anda. Tanyakan apa saja — analisis penjualan, kondisi stok, insight pelanggan, atau ide marketing.\n\nApa yang ingin Anda ketahui hari ini?",
    timestamp: now(),
};

export default function AiAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function handleSubmit() {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: trimmed,
            timestamp: now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        setError("");

        try {
            const history = messages
                .filter(m => m.id !== "welcome")
                .slice(-6)
                .map(m => ({ role: m.role, content: m.content }));

            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed, history }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Gagal mendapatkan respons AI");
                return;
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.response,
                timestamp: now(),
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    function handleChipSelect(query: string) {
        setInput(query);
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-buddy-purple rounded-2xl flex items-center justify-center shadow-lg shadow-buddy-purple/25">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-buddy-text-main">Buddy AI</h1>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-700">Online</span>
                    </div>
                </div>
                <p className="text-sm text-buddy-text-muted">
                    Asisten AI untuk analisis bisnis, rekomendasi, dan insight real-time
                </p>
            </div>

            {error && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[300px]">
                <AiConversation messages={messages} loading={loading} />
                <div ref={bottomRef} />
            </div>

            <div className="mb-4">
                <AiCommandBar
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </div>

            <AiSuggestionChips onSelect={handleChipSelect} />

            <p className="text-center text-[10px] text-buddy-text-subtle mt-4">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Enter untuk kirim · Buddy AI menggunakan data bisnis real-time Anda
            </p>
        </div>
    );
}
