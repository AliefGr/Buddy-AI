"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#workflow" },
  { label: "Harga", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6D5DF6] flex items-center justify-center shadow-lg shadow-[#6D5DF6]/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Buddy AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#6D5DF6] text-white hover:bg-[#5441DC] transition-all shadow-lg shadow-[#6D5DF6]/20"
          >
            Mulai Gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-6 shadow-lg">
          <nav className="flex flex-col gap-1 mt-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/login" className="w-full py-2.5 text-center text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
              Masuk
            </Link>
            <Link href="/register" className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-[#6D5DF6] text-white hover:bg-[#5441DC] transition-colors">
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
