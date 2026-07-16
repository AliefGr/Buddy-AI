"use client";

import { useState } from "react";
import { Copy, RefreshCw, Send, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MarketingFormData } from "./MarketingForm";

interface MarketingAiResultProps {
    result: string | null;
    formData: MarketingFormData | null;
    loading: boolean;
    onRegenerate: () => void;
}

const platformEmojis: Record<string, string> = {
    instagram: "📸",
    whatsapp: "💬",
    tiktok: "🎵",
    email: "📧",
};

export function MarketingAiResult({
    result,
    formData,
    loading,
    onRegenerate,
}: MarketingAiResultProps) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-buddy-purple" />
                    </div>
                    <div>
                        <p className="font-bold text-buddy-text-main text-sm">Hasil AI</p>
                        <p className="text-[10px] text-buddy-text-subtle">
                            {formData
                                ? `${formData.product} · ${formData.tone}`
                                : "Belum ada konten"}
                        </p>
                    </div>
                </div>
                {formData && (
                    <div className="flex gap-1">
                        {formData.platforms.map((p) => (
                            <span key={p} title={p} className="text-base">
                                {platformEmojis[p] ?? "📱"}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="h-full flex flex-col gap-3 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                        <div className="h-4 bg-gray-100 rounded-full w-full" />
                        <div className="h-4 bg-gray-100 rounded-full w-5/6" />
                        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                        <div className="h-4 bg-gray-100 rounded-full w-full" />
                        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
                        <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                    </div>
                ) : result ? (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 h-full overflow-y-auto">
                        <pre className="text-sm text-buddy-text-main whitespace-pre-wrap leading-relaxed font-sans">
                            {result}
                        </pre>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
                        <div className="w-16 h-16 bg-buddy-purple/5 rounded-3xl flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-buddy-purple/40" />
                        </div>
                        <p className="font-semibold text-buddy-text-main text-sm">
                            Siap Generate Konten
                        </p>
                        <p className="text-xs text-buddy-text-subtle max-w-48 leading-relaxed">
                            Isi form di sebelah kiri lalu klik "Generate Konten AI" untuk memulai
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            {result && !loading && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 justify-center gap-2"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                            </>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 justify-center gap-2"
                        onClick={onRegenerate}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1 justify-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        Publish
                    </Button>
                </div>
            )}
        </Card>
    );
}
