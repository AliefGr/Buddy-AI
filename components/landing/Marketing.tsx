const FLOW = [
  { step: "1", label: "AI Buat Caption", detail: "Generate konten marketing berbasis produk & target audiens Anda", icon: "✍️" },
  { step: "2", label: "Broadcast ke Pelanggan", detail: "Kirim via WhatsApp Business API atau email ke segmen yang ditentukan", icon: "📱" },
  { step: "3", label: "Campaign Berjalan", detail: "Track buka, klik, dan konversi secara real-time di dashboard", icon: "🎯" },
  { step: "4", label: "AI Insight Muncul", detail: "Buddy AI analisis hasil dan rekomendasikan optimasi untuk kampanye berikutnya", icon: "📈" },
];

export default function Marketing() {
  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Flow visual */}
          <div className="space-y-1">
            {FLOW.map((f, i) => (
              <div key={f.step} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#6D5DF6] flex items-center justify-center text-base shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-[#6D5DF6]/20">
                    {f.icon}
                  </div>
                  {i < FLOW.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-2 min-h-[24px]" />}
                </div>
                <div className="pb-6 flex-1">
                  <span className="text-[10px] font-bold text-[#6D5DF6]/60 uppercase tracking-widest">Langkah {f.step}</span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5 mb-1">{f.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Text */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-xs font-semibold mb-5 uppercase tracking-widest">
              Marketing AI
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5">
              Marketing Otomatis,
              <br />
              <span className="text-[#6D5DF6]">Berbasis Data Real</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Tidak perlu jadi ahli marketing. Buddy AI membuatkan konten, menentukan waktu kirim terbaik, dan menganalisis hasilnya — semua otomatis berdasarkan data pelanggan Anda.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "3x", label: "Lebih banyak repeat order" },
                { val: "60%", label: "Hemat waktu marketing" },
                { val: "2x", label: "Open rate lebih tinggi" },
                { val: "40%", label: "Peningkatan konversi" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-gray-100 bg-[#F8F9FE] p-4 shadow-sm">
                  <div className="text-2xl font-bold text-[#6D5DF6]">{s.val}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
