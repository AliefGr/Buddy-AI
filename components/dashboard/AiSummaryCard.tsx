"use client";

import { useState } from "react";
import { Sparkle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export function AiSummaryCard() {
    const [brief, setBrief] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    async function generateBrief() {
        setLoading(true);
        try {
            const res = await fetch("/api/ai/daily-brief", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setBrief(data.brief);
                setGenerated(true);
            } else {
                setBrief(data.error ?? "Gagal generate brief");
                setGenerated(true);
            }
        } catch {
            setBrief("Terjadi kesalahan. Pastikan GEMINI_API_KEY sudah dikonfigurasi.");
            setGenerated(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="col-span-1 lg:col-span-8 flex flex-col lg:flex-row relative overflow-hidden gap-6">
            <div className="flex-1 z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkle className="w-5 h-5 text-buddy-purple" />
                    <span className="text-sm font-bold text-gray-800">Ringkasan AI</span>
                </div>

                {!generated ? (
                    <>
                        <h2 className="text-xl lg:text-2xl font-bold text-buddy-text-main mb-2">
                            Dapatkan insight bisnis
                            <br />
                            Anda hari ini dari AI.
                        </h2>
                        <p className="text-sm text-gray-400 mb-4 lg:mb-6">
                            Buddy AI akan menganalisis data real-time bisnis Anda
                        </p>
                        <Button variant="primary" size="md" loading={loading} onClick={generateBrief}>
                            {loading ? "Menganalisis..." : (
                                <>
                                    <span>Generate Daily Brief</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="prose prose-sm max-w-none mb-4">
                            <p className="text-sm text-buddy-text-main leading-relaxed whitespace-pre-wrap">{brief}</p>
                        </div>
                        <Button variant="secondary" size="sm" loading={loading} onClick={generateBrief} className="gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </Button>
                    </>
                )}
            </div>

            <div className="absolute right-32 -bottom-5 w-64 h-64 opacity-80 pointer-events-none hidden xl:block">
                <Image
                    src="https://lh3.googleusercontent.com/aida/AP1WRLvxV9v8Fv2zQ2JgxF1ShTVYHULas4E39wdTMhcK_5WOZTNcKFC_crHY5pZ8qfFYK_LsR-hzuPH6mdAokQf2cX4W-lU4EWalhgbbv0eF8HX5UfvBM9U1U7knqDNzVVIKJWfGf0oxots9x-732Fz0JzbYB18ycXkNz9sud3i3M7MU5lfNimhM7I9wH8Swcljnk-Nzr-aIkxycWG392_RW_K6ECxsqBk8QOJBq6hO9oBJ8wq08oXGOzDbxGzF3"
                    alt="Buddy Mascot"
                    width={256}
                    height={256}
                    className="object-contain w-full h-full scale-150"
                    unoptimized
                />
            </div>
        </Card>
    );
}
