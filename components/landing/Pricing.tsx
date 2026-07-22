"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { useState } from "react";

const PLANS = [
  {
    id: "free", name: "Free", monthly: 0, yearly: 0,
    desc: "Mulai kelola bisnis tanpa bayar. Cocok untuk UMKM baru.",
    cta: "Mulai Gratis", href: "/register", popular: false,
    features: [
      { text: "1 toko", ok: true }, { text: "50 produk", ok: true },
      { text: "100 transaksi/bulan", ok: true }, { text: "Dashboard Analytics", ok: true },
      { text: "AI Assistant (10x/hari)", ok: true }, { text: "Broadcast WhatsApp", ok: false },
      { text: "Marketing AI", ok: false }, { text: "Export PDF/Excel", ok: false },
    ],
  },
  {
    id: "starter", name: "Starter", monthly: 99000, yearly: 79000,
    desc: "Untuk UMKM yang mulai berkembang dan butuh fitur lebih.",
    cta: "Coba 14 Hari Gratis", href: "/register?plan=starter", popular: false,
    features: [
      { text: "1 toko", ok: true }, { text: "500 produk", ok: true },
      { text: "Transaksi tak terbatas", ok: true }, { text: "Dashboard Analytics", ok: true },
      { text: "AI Assistant (tak terbatas)", ok: true }, { text: "Broadcast WhatsApp (500/bln)", ok: true },
      { text: "Marketing AI", ok: true }, { text: "Export PDF/Excel", ok: true },
    ],
  },
  {
    id: "pro", name: "Pro", monthly: 249000, yearly: 199000,
    desc: "Fitur penuh untuk bisnis yang serius tumbuh.",
    cta: "Mulai Pro Sekarang", href: "/register?plan=pro", popular: true,
    features: [
      { text: "3 toko", ok: true }, { text: "Produk tak terbatas", ok: true },
      { text: "Transaksi tak terbatas", ok: true }, { text: "Analytics + AI Insight", ok: true },
      { text: "AI Assistant (tak terbatas)", ok: true }, { text: "Broadcast tak terbatas", ok: true },
      { text: "Marketing AI + Campaign", ok: true }, { text: "Prioritas support", ok: true },
    ],
  },
  {
    id: "enterprise", name: "Enterprise", monthly: -1, yearly: -1,
    desc: "Solusi custom untuk jaringan toko dan franchise.",
    cta: "Hubungi Kami", href: "mailto:hello@buddy.ai", popular: false,
    features: [
      { text: "Toko tak terbatas", ok: true }, { text: "Custom integrasi", ok: true },
      { text: "Dedicated AI model", ok: true }, { text: "SLA 99.9% uptime", ok: true },
      { text: "Dedicated account manager", ok: true }, { text: "Custom onboarding", ok: true },
      { text: "Audit log & compliance", ok: true }, { text: "Custom contract", ok: true },
    ],
  },
];

function fmt(p: number) {
  if (p === 0) return "Gratis";
  if (p === -1) return "Custom";
  return `Rp ${p.toLocaleString("id-ID")}`;
}

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-xs font-semibold mb-5 uppercase tracking-widest">
            Harga
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Harga Transparan,
            <br />
            <span className="text-[#6D5DF6]">Sesuai Kebutuhan</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.
          </p>
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button onClick={() => setYearly(false)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
              Bulanan
            </button>
            <button onClick={() => setYearly(true)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
              Tahunan <span className="ml-1 text-[10px] font-bold text-green-500">Hemat 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative rounded-3xl border p-6 flex flex-col transition-all ${plan.popular ? "border-[#6D5DF6]/30 bg-[#6D5DF6]/3 shadow-lg shadow-[#6D5DF6]/10" : "border-gray-100 bg-white shadow-sm hover:border-[#6D5DF6]/20 hover:shadow-md"}`}>
              {plan.popular && (
                <>
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6D5DF6]/50 to-transparent" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#6D5DF6] text-white text-[10px] font-bold shadow-lg">
                      <Zap className="w-2.5 h-2.5" /> PALING POPULER
                    </span>
                  </div>
                </>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{fmt(yearly ? plan.yearly : plan.monthly)}</span>
                  {plan.monthly > 0 && <span className="text-gray-400 text-sm">/bln</span>}
                </div>
              </div>
              <Link href={plan.href} className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all mb-6 ${plan.popular ? "bg-[#6D5DF6] text-white hover:bg-[#5441DC] shadow-md shadow-[#6D5DF6]/20" : "border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-[#6D5DF6]/30 hover:bg-[#6D5DF6]/5"}`}>
                {plan.cta}
              </Link>
              <ul className="space-y-2 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${f.ok ? "text-green-500" : "text-gray-200"}`} />
                    <span className={`text-xs leading-relaxed ${f.ok ? "text-gray-600" : "text-gray-300"}`}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
