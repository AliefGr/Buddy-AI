"use client";

import { useState } from "react";
import { Sparkles, Send, TrendingUp, Package, Users } from "lucide-react";

const CONVERSATIONS = [
  {
    q: "Bagaimana penjualan minggu ini?",
    a: "Omzet minggu ini Rp 8,4 juta, naik 23% dari minggu lalu 🎉. Produk terlaris: Kopi Susu Gula Aren (47 unit). Hari terbaik: Sabtu dengan Rp 1,8 juta. Saya rekomendasikan stok Kopi Susu ditambah 30% untuk akhir pekan.",
    icon: TrendingUp,
  },
  {
    q: "Produk mana yang hampir habis stoknya?",
    a: "Ada 3 produk dengan stok kritis: Arabica Blend (sisa 5 unit, estimasi habis 2 hari), Brown Sugar Syrup (sisa 8 unit), dan Cup 12oz (sisa 20 unit). Saya sarankan restock segera sebelum weekend.",
    icon: Package,
  },
  {
    q: "Buatkan caption promo akhir tahun",
    a: "✨ Akhir tahun, saatnya nikmati yang terbaik! Dapatkan Buy 2 Get 1 untuk semua minuman signature kami. Promo berlaku 25-31 Desember. Pesan sekarang dan rasakan kehangatan di setiap tegukan ☕🎄",
    icon: Users,
  },
];

export default function AIShowcase() {
  const [active, setActive] = useState(0);
  const [typing, setTyping] = useState(false);

  function handleSelect(i: number) {
    if (i === active) return;
    setTyping(true);
    setTimeout(() => { setActive(i); setTyping(false); }, 600);
  }

  const current = CONVERSATIONS[active];

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#6D5DF6]/5 rounded-full blur-[8rem] pointer-events-none -translate-y-1/2" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-xs font-semibold mb-5 uppercase tracking-widest">
              AI Assistant
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5">
              Tanya Apa Saja,
              <br />
              <span className="text-[#6D5DF6]">Jawaban Real Data</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              AI Assistant Buddy memahami data bisnis Anda. Tanya tentang penjualan, stok, pelanggan, atau minta dibuatkan konten marketing — semuanya berdasarkan data nyata toko Anda.
            </p>
            <div className="flex flex-col gap-2">
              {CONVERSATIONS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${i === active
                      ? "border-[#6D5DF6]/30 bg-[#6D5DF6]/8 text-gray-900"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:text-gray-700 hover:border-gray-200"
                    }`}
                >
                  <c.icon className={`w-4 h-4 shrink-0 ${i === active ? "text-[#6D5DF6]" : "text-gray-300"}`} />
                  {c.q}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Chat UI */}
          <div className="relative">
            <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-xl">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-lg bg-[#6D5DF6] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Buddy AI</p>
                  <p className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Online — Siap membantu
                  </p>
                </div>
              </div>
              {/* Chat body */}
              <div className="p-5 space-y-4 min-h-[260px] bg-[#F8F9FE]">
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-[#6D5DF6] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white shadow-sm">
                    {current.q}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#6D5DF6] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="max-w-[80%] bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 leading-relaxed shadow-sm">
                    {typing ? (
                      <div className="flex items-center gap-1 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : current.a}
                  </div>
                </div>
              </div>
              {/* Input bar */}
              <div className="px-5 pb-5 bg-[#F8F9FE]">
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <input readOnly placeholder="Tanya sesuatu tentang bisnis Anda..." className="flex-1 bg-transparent text-sm text-gray-400 placeholder:text-gray-300 outline-none cursor-default" />
                  <button className="w-7 h-7 rounded-lg bg-[#6D5DF6] flex items-center justify-center shrink-0">
                    <Send className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-[#6D5DF6]/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
