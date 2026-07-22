"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sari Dewi",
    role: "Pemilik Warung Kopi, Bandung",
    avatar: "SD",
    color: "from-[#6D5DF6] to-purple-500",
    text: "Buddy AI benar-benar mengubah cara saya kelola bisnis. Dulu saya catat penjualan manual di buku, sekarang semua otomatis dan saya bisa lihat insight langsung dari HP.",
    stars: 5,
  },
  {
    name: "Budi Santoso",
    role: "Owner Toko Sembako, Surabaya",
    avatar: "BS",
    color: "from-blue-500 to-indigo-600",
    text: "Fitur broadcast WhatsApp-nya luar biasa! Pelanggan saya selalu dapat notifikasi promo tepat waktu. Omzet naik 40% dalam 3 bulan pertama pakai Buddy AI.",
    stars: 5,
  },
  {
    name: "Rina Marlina",
    role: "Pemilik Online Shop Fashion, Jakarta",
    avatar: "RM",
    color: "from-pink-500 to-rose-600",
    text: "Saya paling suka AI Assistant-nya. Bisa tanya langsung 'produk mana yang lagi trending minggu ini' dan langsung dapat jawaban berdasarkan data penjualan saya.",
    stars: 5,
  },
  {
    name: "Hendra Kusuma",
    role: "Pemilik Restoran, Yogyakarta",
    avatar: "HK",
    color: "from-green-500 to-teal-600",
    text: "Manajemen inventory yang paling bikin saya happy. Alert stok rendah datang otomatis, jadi saya nggak pernah kehabisan bahan baku lagi pas weekend ramai.",
    stars: 5,
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  function prev() { setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }
  function next() { setIdx((i) => (i + 1) % TESTIMONIALS.length); }

  const t = TESTIMONIALS[idx];

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FE] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-xs font-semibold mb-5 uppercase tracking-widest">
            Testimoni
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Dipercaya UMKM
            <br />
            <span className="text-[#6D5DF6]">di Seluruh Indonesia</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl border border-gray-100 bg-white p-8 lg:p-12 shadow-sm">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6D5DF6]/20 to-transparent" />
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#6D5DF6] fill-[#6D5DF6]" />
              ))}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:border-[#6D5DF6]/30 flex items-center justify-center transition-all group shadow-sm">
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#6D5DF6] transition-colors" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i === idx ? "w-6 h-2 bg-[#6D5DF6]" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:border-[#6D5DF6]/30 flex items-center justify-center transition-all group shadow-sm">
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#6D5DF6] transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
