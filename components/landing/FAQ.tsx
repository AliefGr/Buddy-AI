"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Apakah Buddy AI cocok untuk UMKM kecil?",
    a: "Ya! Buddy AI dirancang khusus untuk UMKM Indonesia dari skala kecil hingga menengah. Paket Free sudah cukup untuk memulai, dan Anda bisa upgrade sesuai kebutuhan.",
  },
  {
    q: "Apakah data bisnis saya aman?",
    a: "Sangat aman. Data Anda dienkripsi end-to-end dan disimpan di server Indonesia. Kami tidak pernah menjual atau berbagi data Anda kepada pihak ketiga manapun.",
  },
  {
    q: "Bagaimana cara AI Assistant bekerja?",
    a: "AI Assistant Buddy mengakses data bisnis Anda secara real-time (produk, penjualan, stok, pelanggan) untuk memberikan jawaban dan insight yang relevan dan akurat — bukan jawaban generik.",
  },
  {
    q: "Apakah perlu keahlian teknis untuk menggunakan Buddy AI?",
    a: "Tidak perlu. Buddy AI dirancang semudah mungkin. Setup membutuhkan kurang dari 10 menit, dan antarmukanya intuitif untuk siapa saja tanpa latar belakang teknis.",
  },
  {
    q: "Bisakah saya import data dari Excel atau sistem lain?",
    a: "Bisa. Buddy AI mendukung import produk, pelanggan, dan data transaksi dari file Excel/CSV. Untuk integrasi sistem lain, tersedia di paket Pro dan Enterprise.",
  },
  {
    q: "Bagaimana cara broadcast ke pelanggan via WhatsApp?",
    a: "Hubungkan akun WhatsApp Business API Anda di pengaturan (perlu WhatsApp Business API dari Meta). Setelah terhubung, Anda bisa kirim broadcast ke semua atau segmen pelanggan tertentu.",
  },
  {
    q: "Apakah ada uji coba gratis untuk paket berbayar?",
    a: "Ya! Paket Starter dan Pro bisa dicoba 14 hari gratis tanpa kartu kredit. Setelah trial berakhir, Anda bisa pilih untuk berlangganan atau kembali ke paket Free.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-32 relative">
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-buddy-purple/5 rounded-full blur-[8rem] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-buddy-purple/20 bg-buddy-purple/5 text-buddy-purple text-xs font-medium mb-6 uppercase tracking-widest">
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-buddy-text-main">Ada Pertanyaan?</span>
            <br />
            <span className="text-buddy-purple">Kami Jawab Di Sini</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all ${open === i ? "border-buddy-purple/30 bg-white" : "border-gray-100 bg-white hover:border-buddy-purple/20"}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold text-buddy-text-main pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-buddy-purple" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-buddy-text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
