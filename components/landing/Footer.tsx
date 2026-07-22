import Link from "next/link";
import { Zap } from "lucide-react";

const LINKS = {
  Produk: [
    { label: "Fitur", href: "#features" },
    { label: "Harga", href: "#pricing" },
    { label: "Cara Kerja", href: "#workflow" },
    { label: "AI Assistant", href: "#ai-showcase" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Karir", href: "#" },
    { label: "Kontak", href: "#" },
  ],
  Dukungan: [
    { label: "Pusat Bantuan", href: "#" },
    { label: "Dokumentasi", href: "#" },
    { label: "Status Sistem", href: "#" },
    { label: "WhatsApp Support", href: "#" },
  ],
  Legal: [
    { label: "Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kebijakan Cookie", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-100 pt-16 pb-10 overflow-hidden bg-white">
      {/* Top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-buddy-purple/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-buddy-purple flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-buddy-text-main">Buddy AI</span>
            </Link>
            <p className="text-sm text-buddy-text-muted leading-relaxed max-w-xs mb-6">
              AI Business Assistant untuk UMKM Indonesia. Kelola bisnis lebih cerdas.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-buddy-text-main placeholder:text-gray-400 outline-none focus:border-buddy-purple/40 transition-colors"
              />
              <button className="px-4 py-2 rounded-xl bg-buddy-purple text-white text-sm font-semibold shrink-0 hover:bg-[#5441DC] transition-all">
                Ikuti
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{group}</h3>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-buddy-text-muted hover:text-buddy-purple transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Buddy AI. Dibuat dengan ❤️ untuk UMKM Indonesia.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-gray-400">Semua sistem berjalan normal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
