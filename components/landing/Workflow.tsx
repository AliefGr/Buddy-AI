const STEPS = [
  { number: "01", title: "Tambah Produk", desc: "Daftarkan produk, harga, stok, dan kategori dalam hitungan menit. Import dari Excel juga bisa.", icon: "📦" },
  { number: "02", title: "Catat Penjualan", desc: "Rekam setiap transaksi — manual atau otomatis. Stok langsung berkurang, pelanggan terupdate.", icon: "💳" },
  { number: "03", title: "AI Analisis", desc: "Buddy AI membaca semua data dan memberikan insight: tren, rekomendasi, prediksi, dan alert.", icon: "🤖" },
  { number: "04", title: "Broadcast & Campaign", desc: "Kirim promosi ke pelanggan via WhatsApp/email. AI bantu buatkan pesan yang tepat sasaran.", icon: "📣" },
  { number: "05", title: "Lihat Laporan", desc: "Pantau omzet, profit, dan pertumbuhan bisnis kapan saja. Export PDF/Excel dalam satu klik.", icon: "📊" },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 lg:py-28 bg-[#F8F9FE] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-xs font-semibold mb-5 uppercase tracking-widest">
            Cara Kerja
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Dari Produk ke Profit
            <br />
            <span className="text-[#6D5DF6]">5 Langkah Mudah</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Buddy AI mengotomasi alur kerja bisnis Anda dari ujung ke ujung.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[calc(10%+2rem)] right-[calc(10%+2rem)] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center relative group">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl border border-gray-100 bg-white group-hover:border-[#6D5DF6]/20 group-hover:shadow-md transition-all flex items-center justify-center text-3xl shadow-sm">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-[#6D5DF6] flex items-center justify-center shadow-sm">
                    <span className="text-[9px] font-bold text-white">{step.number}</span>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="sm:hidden w-px h-6 bg-gray-200 mb-8" />}
                <h3 className="text-sm font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[160px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
