import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-buddy-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-buddy-purple/20 p-12 lg:p-20 text-center bg-white">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#1F2937 1px, transparent 1px), linear-gradient(90deg, #1F2937 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1/2 h-1/2 rounded-full bg-buddy-purple/20 blur-[6rem]" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-buddy-purple flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-buddy-purple/30">
              <Zap className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-buddy-text-main">Siap Kembangkan</span>
              <br />
              <span className="text-buddy-purple">
                Bisnis Anda?
              </span>
            </h2>

            <p className="text-buddy-text-muted text-lg max-w-xl mx-auto mb-10">
              Bergabung dengan 10,000+ UMKM Indonesia yang sudah menggunakan Buddy AI untuk tumbuh lebih cepat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-10 py-4 rounded-2xl bg-buddy-purple text-white font-bold text-base hover:bg-[#5441DC] transition-all shadow-2xl shadow-buddy-purple/25 hover:shadow-buddy-purple/40 hover:-translate-y-0.5"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-400 text-sm">
                Tidak perlu kartu kredit · Setup 10 menit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
