"use client";

import { useEffect, useRef } from "react";
import { Sparkles, User } from "lucide-react";

export interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: string;
    cards?: Array<{ label: string; value: string; color: string }>;
}

interface AiConversationProps {
    messages: Message[];
    loading: boolean;
}

function AiMessageCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className={`${color} rounded-xl p-3 flex-1 min-w-24`}>
            <p className="text-[9px] font-bold uppercase tracking-wider opacity-70 mb-0.5">{label}</p>
            <p className="font-bold text-sm">{value}</p>
        </div>
    );
}

// Render a single line with inline formatting (bold, italic, inline code)
function InlineMd({ text }: { text: string }) {
    const parts: React.ReactNode[] = [];
    // matches **bold**, *italic*, `code`
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
    let last = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
            parts.push(text.slice(last, match.index));
        }
        if (match[2]) {
            parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
        } else if (match[3]) {
            parts.push(<em key={key++}>{match[3]}</em>);
        } else if (match[4]) {
            parts.push(
                <code key={key++} className="bg-gray-100 text-buddy-purple px-1 py-0.5 rounded text-[11px] font-mono">
                    {match[4]}
                </code>
            );
        }
        last = match.index + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return <>{parts}</>;
}

// Render full Markdown content as structured JSX
function MarkdownContent({ content }: { content: string }) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let bulletBuffer: string[] = [];
    let key = 0;

    function flushBullets() {
        if (bulletBuffer.length === 0) return;
        elements.push(
            <ul key={key++} className="space-y-1 my-1 pl-1">
                {bulletBuffer.map((item, i) => (
                    <li key={i} className="flex gap-2 items-start">
                        <span className="text-buddy-purple mt-1 shrink-0">•</span>
                        <span><InlineMd text={item} /></span>
                    </li>
                ))}
            </ul>
        );
        bulletBuffer = [];
    }

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        // Heading ### or ##
        if (/^#{1,3}\s/.test(line)) {
            flushBullets();
            const text = line.replace(/^#{1,3}\s/, "");
            elements.push(
                <p key={key++} className="font-bold text-buddy-text-main mt-2 mb-0.5">
                    <InlineMd text={text} />
                </p>
            );
            continue;
        }

        // Bullet: * item  or - item  or • item
        if (/^[\*\-•]\s/.test(line)) {
            bulletBuffer.push(line.replace(/^[\*\-•]\s/, ""));
            continue;
        }

        // Numbered list: 1. item
        if (/^\d+\.\s/.test(line)) {
            bulletBuffer.push(line.replace(/^\d+\.\s/, ""));
            continue;
        }

        // Horizontal rule ---
        if (/^-{3,}$/.test(line) || /^\*{3,}$/.test(line)) {
            flushBullets();
            elements.push(<hr key={key++} className="border-gray-100 my-2" />);
            continue;
        }

        // Empty line
        if (line === "") {
            flushBullets();
            elements.push(<div key={key++} className="h-1" />);
            continue;
        }

        // Normal paragraph
        flushBullets();
        elements.push(
            <p key={key++} className="leading-relaxed">
                <InlineMd text={line} />
            </p>
        );
    }

    flushBullets();
    return <div className="space-y-0.5 text-sm">{elements}</div>;
}

export function AiConversation({ messages, loading }: AiConversationProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    if (messages.length === 0 && !loading) return null;

    return (
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                    {/* Avatar */}
                    <div
                        className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "ai"
                                ? "bg-buddy-purple text-white"
                                : "bg-gray-200 text-buddy-text-muted"
                            }`}
                    >
                        {msg.role === "ai" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div
                            className={`rounded-2xl px-4 py-3 ${msg.role === "user"
                                    ? "bg-buddy-purple text-white rounded-tr-sm text-sm leading-relaxed"
                                    : "bg-white border border-gray-100 shadow-sm text-buddy-text-main rounded-tl-sm"
                                }`}
                        >
                            {msg.role === "user" ? (
                                msg.content
                            ) : (
                                <MarkdownContent content={msg.content} />
                            )}

                            {msg.cards && msg.cards.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {msg.cards.map((card) => (
                                        <AiMessageCard key={card.label} {...card} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[9px] text-buddy-text-subtle mt-1 px-1">{msg.timestamp}</span>
                    </div>
                </div>
            ))}

            {/* Loading bubble */}
            {loading && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-buddy-purple flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1 items-center h-5">
                            <span className="w-1.5 h-1.5 bg-buddy-purple/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-buddy-purple/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-buddy-purple/40 rounded-full animate-bounce" />
                        </div>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}
