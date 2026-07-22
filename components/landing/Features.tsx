import { MessageSquare, BarChart2, Package, Users, Megaphone, FileText, Target, Send, Settings } from "lucide-react";

const FEATURES = [
  { icon: MessageSquare, title: "AI Assistant", desc: "Chat dengan AI untuk analisis bisnis, saran strategi, dan jawaban instan tentang data Anda.", color: "from-[#6D5DF6] to-[#5441DC]", span: "lg:col-span-4" },
  { icon: BarChart2, title: "Dashboard Analytics", desc: "Pantau KPI, omzet, tren penjualan, dan insight pelanggan dalam satu tampilan real-time.", color: "from-blue-500 to-blue-700", span: "lg:col-span-4" },
  { icon: Package, title: "Manajemen Inventory", desc: "Kelola stok otomatis, alert restock, dan prediksi kehabisan stok berbasis AI.", color: "from-green-500 to-green-700", span: "lg:col-span-4" },
  { icon: Users, title: "CRM Pelanggan", desc: "Database pelanggan lengkap, riwayat transaksi, segmentasi, dan analisis loyalitas.", color: "from-teal-500 to-cyan-600", span: "lg:col-span-3" },
  { icon: Megaphone, title: "Marketing AI", desc: "Generate konten marketing, caption produk, dan strategi kampanye otomatis.", color: "from-pink-500 to-rose-600", span: "lg:col-span-3" },
  { icon: Target, title: "Campaign Manager", desc: "Buat, jalankan, dan pantau kampanye promosi dengan tracking performa real-time.", color: "from-violet-500 to-purple-700", span: "lg:col-span-3" },
  { icon: Send, title: "Broadcast", desc: "Kirim pesan massal ke pelanggan via WhatsApp dan email dengan personalisasi AI.", color: "from-indigo-500 to-indigo-700", span: "lg:col-span-3" },
  { icon: FileText, title: "Laporan Otomatis", desc: "Laporan bulanan, tahunan, dan custom — diekspor ke PDF/Excel dalam satu klik.", color: "from-amber-500 to-orange-600", span: "lg:col-span-6" },
  { icon: Settings, title: "Pengaturan Lengkap", desc: "Konfigurasi toko, integrasi WhatsApp Business API, SMTP email, dan lainnya.", color: "from-slate-500 to-gray-600", span: "lg:col-span-6" },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F8F9FE] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D5DF6]/20 bg-[#6D5DF6]/5 text-[#6D5DF6] text-xs font-semibold mb-5 uppercase tracking-widest">
            Fitur Lengkap
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Semua yang Anda Butuhkan
            <br />
            <span className="text-[#6D5DF6]">Ada di Sini</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Dari manajemen produk hingga broadcast marketing — semuanya terintegrasi dan didukung AI.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`${f.span} group relative rounded-3xl border border-gray-100 bg-white p-6 overflow-hidden hover:border-[#6D5DF6]/20 hover:shadow-md transition-all duration-300 shadow-sm`}
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6D5DF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
