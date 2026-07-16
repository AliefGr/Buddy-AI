"use client";

import { Sparkles, Send, Loader2 } from "lucide-react";
import { KeyboardEvent } from "react";

interface AiCommandBarProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

export function AiCommandBar({ value, onChange, onSubmit, loading }: AiCommandBarProps) {
    function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-black/5 p-4 flex items-end gap-3">
            <div className="w-9 h-9 bg-buddy-purple/10 rounded-2xl flex items-center justify-center shrink-0 mb-0.5">
                <Sparkles className="w-4 h-4 text-buddy-purple" />
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Apa yang ingin Anda analisis hari ini?"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-buddy-text-main placeholder:text-buddy-text-subtle focus:outline-none leading-relaxed min-h-[36px] max-h-32 py-2"
                style={{ height: "auto" }}
            />
            <button
                onClick={onSubmit}
                disabled={loading || !value.trim()}
                className="w-9 h-9 bg-buddy-purple rounded-2xl flex items-center justify-center shrink-0 mb-0.5 transition-all hover:bg-buddy-purple-dim disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-buddy-purple/25"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                    <Send className="w-4 h-4 text-white" />
                )}
            </button>
        </div>
    );
}
