"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Package,
  FolderOpen,
  Database,
  ShoppingCart,
  Users,
  Megaphone,
  Target,
  Send,
  Settings,
  DollarSign,
  FileText,
  CheckCircle,
  UserPlus,
  Search,
  Bell,
  HelpCircle,
  TrendingUp,
  Archive,
  Sparkle,
  Loader2,
} from "lucide-react";
import { useEffect, useRef } from "react";

const BADGES = [
  { text: "💰 Omzet Naik 32%", top: "18%", left: "2%" },
  { text: "📦 Stok Auto-Reorder", top: "30%", right: "2%" },
  { text: "📣 Broadcast 1-Klik", top: "62%", left: "2%" },
  { text: "🤖 AI Insight Harian", top: "72%", right: "2%" },
];

const navSections = [
  {
    label: null,
    items: [{ icon: LayoutDashboard, label: "Dashboard", active: true }],
  },
  {
    label: "AI Copilot",
    items: [
      { icon: MessageSquare, label: "AI Assistant", active: false },
      { icon: Sparkles, label: "AI Insight", active: false },
      { icon: Calendar, label: "Daily Brief", active: false },
    ],
  },
  {
    label: "Business",
    items: [
      { icon: Package, label: "Produk", active: false },
      { icon: FolderOpen, label: "Kategori", active: false },
      { icon: Database, label: "Inventory", active: false },
      { icon: ShoppingCart, label: "Penjualan", active: false },
      { icon: Users, label: "Pelanggan", active: false },
    ],
  },
  {
    label: "Marketing",
    items: [
      { icon: Megaphone, label: "Marketing AI", active: false },
      { icon: Target, label: "Campaign", active: false },
      { icon: Send, label: "Broadcast", active: false },
    ],
  },
];

const KPI_CARDS = [
  {
    icon: DollarSign,
    label: "Total Omzet",
    value: "Rp 128,3Jt",
    trend: "+15,2%",
    iconColor: "purple",
    trendDirection: "up" as const,
  },
  {
    icon: FileText,
    label: "Total Transaksi",
    value: "2.450",
    trend: "+12,1%",
    iconColor: "blue",
    trendDirection: "up" as const,
  },
  {
    icon: CheckCircle,
    label: "Produk Terjual",
    value: "1.250",
    trend: "+8,3%",
    iconColor: "green",
    trendDirection: "up" as const,
  },
  {
    icon: UserPlus,
    label: "Pelanggan Baru",
    value: "156",
    trend: "+10,7%",
    iconColor: "orange",
    trendDirection: "up" as const,
  },
];

const CHART_DATA = [20, 25, 45, 35, 55, 30, 65, 80];
const REALTIME_CHART_DATA = [
  10, 15, 12, 25, 20, 30, 45, 40, 55, 50, 65, 60, 75,
];

function getIconBg(color: string) {
  switch (color) {
    case "purple":
      return "bg-buddy-purple/10";
    case "blue":
      return "bg-blue-100";
    case "green":
      return "bg-green-100";
    case "orange":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
}

function getIconColor(color: string) {
  switch (color) {
    case "purple":
      return "#6D5DF6";
    case "blue":
      return "#3B82F6";
    case "green":
      return "#10B981";
    case "orange":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
}

function drawChart(
  ctx: CanvasRenderingContext2D,
  data: number[],
  w: number,
  h: number,
) {
  ctx.clearRect(0, 0, w, h);
  if (data.length < 2) return;
  const max = Math.max(...data, 1);
  ctx.beginPath();
  ctx.strokeStyle = "#f1f1f1";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(0, (h / 4) * i);
    ctx.lineTo(w, (h / 4) * i);
  }
  ctx.stroke();
  const stepX = w / (data.length - 1);
  ctx.beginPath();
  ctx.strokeStyle = "rgba(109,93,246,1)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(0, h - (data[0] / max) * (h - 10));
  for (let i = 1; i < data.length; i++) {
    const x = i * stepX;
    const y = h - (data[i] / max) * (h - 10);
    const px = (i - 1) * stepX;
    const py = h - (data[i - 1] / max) * (h - 10);
    ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
  }
  ctx.stroke();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(109,93,246,0.2)");
  grad.addColorStop(1, "rgba(109,93,246,0)");
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawRealtimeChart(
  ctx: CanvasRenderingContext2D,
  data: number[],
  w: number,
  h: number,
) {
  ctx.clearRect(0, 0, w, h);
  if (data.length < 2) return;
  const max = Math.max(...data, 1);
  const stepX = w / (data.length - 1);
  ctx.beginPath();
  ctx.strokeStyle = "rgba(109,93,246,1)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(0, h - (data[0] / max) * (h - 10));
  for (let i = 1; i < data.length; i++) {
    const x = i * stepX;
    const y = h - (data[i] / max) * (h - 10);
    const px = (i - 1) * stepX;
    const py = h - (data[i - 1] / max) * (h - 10);
    ctx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
  }
  ctx.stroke();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(109,93,246,0.2)");
  grad.addColorStop(1, "rgba(109,93,246,0)");
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fillStyle = grad;
  ctx.fill();
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const realtimeCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const pts: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    }[] = [];
    for (let i = 0; i < 50; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
        a: Math.random() * 0.3 + 0.05,
      });
    }
    let raf: number;
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of pts) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(109,93,246,${p.a})`;
        ctx!.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const canvas = realtimeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawRealtimeChart(ctx, REALTIME_CHART_DATA, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setTimeout(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart(ctx, CHART_DATA, canvas.width, canvas.height);
    }, 100);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-buddy-bg">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-buddy-purple/10 rounded-full blur-[8rem]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-buddy-purple/8 rounded-full blur-[8rem]" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-400/6 rounded-full blur-[6rem]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#1F2937 1px, transparent 1px), linear-gradient(90deg, #1F2937 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-buddy-purple/20 bg-buddy-purple/5 text-buddy-purple text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Business Assistant #1 untuk UMKM Indonesia</span>
        </div>

        {/* Headline - EVEN SMALLER SIZE */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-buddy-text-main">Kelola Bisnis Lebih</span>
          <br />
          <span className="text-buddy-purple">Cerdas dengan AI</span>
        </h1>

        {/* Sub */}
        <p className="text-base sm:text-lg text-buddy-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Kelola penjualan, pelanggan, stok, laporan, dan pemasaran dalam satu
          dashboard dengan bantuan AI.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-buddy-purple text-white font-semibold text-base hover:bg-[#5441DC] transition-all shadow-2xl shadow-buddy-purple/25 hover:shadow-buddy-purple/40 hover:-translate-y-0.5"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="flex items-center gap-2.5 px-6 py-4 rounded-2xl border border-gray-200 text-buddy-text-main hover:text-buddy-purple hover:border-buddy-purple/20 hover:bg-buddy-purple/5 transition-all text-sm font-medium">
            <div className="w-7 h-7 rounded-full bg-buddy-purple/10 flex items-center justify-center">
              <Play className="w-3 h-3 ml-0.5 text-buddy-purple" />
            </div>
            Lihat Demo
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16 text-sm">
          {[
            { val: "10,000+", label: "UMKM Aktif" },
            { val: "Rp 2,4T+", label: "Total Transaksi" },
            { val: "98%", label: "Kepuasan Pengguna" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-buddy-text-main">
                {s.val}
              </div>
              <div className="text-buddy-text-muted text-xs mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto max-w-6xl">
          {/* Frame */}
          <div className="relative rounded-2xl border border-buddy-purple/20 bg-white/[0.02] p-1.5 shadow-2xl shadow-buddy-purple/10">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-buddy-purple/40 to-transparent" />
            {/* Inner */}
            <div className="rounded-xl bg-buddy-bg overflow-hidden">
              <div className="flex h-[650px] sm:h-[750px]">
                {/* Sidebar - MATCH REAL SIDEBAR */}
                <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
                  {/* Logo */}
                  <div className="p-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-buddy-purple rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-buddy-text-main tracking-tight">
                      Buddy
                    </span>
                  </div>

                  {/* Nav */}
                  <nav className="flex-1 px-4 py-2 space-y-5 text-sm overflow-hidden">
                    {navSections.map((section, sectionIdx) => (
                      <div key={sectionIdx}>
                        {section.label && (
                          <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            {section.label}
                          </h3>
                        )}
                        <div className="space-y-0.5">
                          {section.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={itemIdx}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                  item.active
                                    ? "sidebar-active"
                                    : "text-gray-400 hover:text-buddy-text-main hover:bg-gray-50"
                                }`}
                              >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </nav>

                  {/* Footer - User Profile */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-buddy-purple/10 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                        <span className="text-sm font-bold text-buddy-purple">
                          AB
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-buddy-text-main truncate">
                          Andi Bisnis
                        </p>
                        <p className="text-[10px] text-gray-500 truncate uppercase">
                          Toko Contoh
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 overflow-hidden bg-buddy-bg">
                  {/* Topbar - MATCH REAL DashboardHeader */}
                  <header className="flex justify-between items-center mb-6 lg:mb-8">
                    {/* Left - greeting */}
                    <div className="flex items-center gap-3">
                      <div>
                        <h1 className="text-lg lg:text-2xl font-bold text-gray-900 leading-tight">
                          Selamat pagi, Andi 👋
                        </h1>
                        <p className="text-gray-500 text-xs lg:text-sm hidden sm:block">
                          Kelola bisnis Anda hari ini
                        </p>
                      </div>
                    </div>

                    {/* Right - search & actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                      {/* Search */}
                      <div className="relative hidden md:block w-56 lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Cari produk, pelanggan, order..."
                          className="w-full pl-10 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                          disabled
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 border border-gray-200 font-mono hidden lg:block">
                          Ctrl K
                        </span>
                      </div>

                      {/* Notification */}
                      <div className="relative">
                        <button className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
                          <Bell className="w-5 h-5 text-gray-600" />
                          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">
                              2
                            </span>
                          </span>
                        </button>
                      </div>

                      {/* Help */}
                      <button className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hidden sm:flex">
                        <HelpCircle className="w-5 h-5 text-gray-600" />
                      </button>

                      {/* Avatar */}
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-50 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center cursor-pointer">
                        <span className="text-sm font-bold text-purple-600">
                          AB
                        </span>
                      </div>
                    </div>
                  </header>

                  {/* Content area - MATCH REAL Dashboard */}
                  <div className="px-4 sm:px-6 lg:px-8 overflow-y-auto h-full">
                    {/* Hero: AI Summary + Realtime Sales */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 mb-3 lg:mb-6">
                      {/* AI Summary Hero */}
                      <div className="col-span-1 lg:col-span-8 bg-white p-3 sm:p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col">
                        <div className="flex-1 z-10">
                          <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <Sparkle className="w-4 h-4 sm:w-5 sm:h-5 text-buddy-purple" />
                            <span className="text-xs sm:text-sm font-bold text-gray-800">
                              Ringkasan AI
                            </span>
                          </div>

                          <h2 className="text-sm sm:text-xl lg:text-2xl font-bold text-buddy-text-main mb-1 sm:mb-2">
                            Saya menemukan 4 hal penting untuk bisnis Anda hari
                            ini.
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                            Diperbarui 2 jam yang lalu
                          </p>

                          {/* Insight List */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="p-2 sm:p-3 bg-red-50 rounded-2xl flex items-center justify-between border border-red-100">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="bg-white p-1.5 sm:p-2 rounded-xl text-red-500 shadow-sm">
                                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] sm:text-xs font-bold text-buddy-text-main">
                                    Penjualan turun 12%
                                  </p>
                                  <p className="text-[8px] sm:text-[10px] text-gray-500">
                                    Dibandingkan kemarin di waktu yang sama
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 sm:p-3 bg-amber-50 rounded-2xl flex items-center justify-between border border-amber-100">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="bg-white p-1.5 sm:p-2 rounded-xl text-amber-500 shadow-sm">
                                  <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] sm:text-xs font-bold text-buddy-text-main">
                                    Stok Kopi Arabika hampir habis
                                  </p>
                                  <p className="text-[8px] sm:text-[10px] text-gray-500">
                                    Sisa 8 pcs, estimasi habis dalam 2 hari
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Mascot Placeholder */}
                        <div className="hidden xl:flex absolute right-8 bottom-[-20px] w-48 h-48 opacity-80 pointer-events-none">
                          <div className="w-full h-full bg-buddy-purple/5 rounded-full flex items-center justify-center">
                            <span className="text-6xl">🤖</span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Sales Card */}
                      <div className="col-span-1 lg:col-span-4 bg-white p-3 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3 sm:mb-6">
                          <h3 className="text-xs sm:text-sm font-bold text-buddy-text-main">
                            Penjualan Hari Ini
                          </h3>
                          <span className="bg-green-100 text-green-600 text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Live</span>
                          </span>
                        </div>
                        <div className="mb-3 sm:mb-6">
                          <p className="text-[8px] sm:text-xs text-gray-400">
                            Omzet Hari Ini
                          </p>
                          <div className="flex items-end gap-2">
                            <span className="text-xl sm:text-2xl font-bold text-buddy-text-main">
                              Rp 4,25Jt
                            </span>
                            <span className="text-green-500 text-[10px] sm:text-xs font-semibold mb-1 flex items-center">
                              <span className="text-xs">↗️</span>
                              18,6%{" "}
                              <span className="text-gray-400 font-normal ml-1">
                                dari kemarin
                              </span>
                            </span>
                          </div>
                        </div>
                        {/* Simple Sparkline Canvas */}
                        <div className="h-16 sm:h-24 w-full mb-3 sm:mb-6">
                          <canvas
                            ref={realtimeCanvasRef}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          <div className="p-2 sm:p-3 border border-gray-100 rounded-2xl">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">
                              Transaksi
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-buddy-text-main">
                                86
                              </span>
                              <span className="text-green-500 text-[8px] sm:text-[10px] flex items-center">
                                <span className="text-xs">↗️</span> 12,5%
                              </span>
                            </div>
                          </div>
                          <div className="p-2 sm:p-3 border border-gray-100 rounded-2xl">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">
                              Avg. Order
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-buddy-text-main">
                                Rp 49.418
                              </span>
                              <span className="text-green-500 text-[8px] sm:text-[10px] flex items-center">
                                <span className="text-xs">↗️</span> 6,3%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 lg:mb-6">
                      {KPI_CARDS.map((k, idx) => {
                        const Icon = k.icon;
                        return (
                          <div
                            key={idx}
                            className="bg-white p-2.5 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4"
                          >
                            <div
                              className={`w-6 h-6 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl ${getIconBg(k.iconColor)} flex items-center justify-center shrink-0`}
                            >
                              <Icon
                                className="w-3 h-3 sm:w-5 sm:h-5"
                                style={{ color: getIconColor(k.iconColor) }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                                {k.label}
                              </p>
                              <p className="text-sm sm:text-lg font-bold text-buddy-text-main truncate">
                                {k.value}
                              </p>
                              <p
                                className={`text-[8px] sm:text-[10px] font-semibold flex items-center ${k.trendDirection === "up" ? "text-green-500" : "text-amber-500"}`}
                              >
                                <span className="text-xs mr-0.5">↗️</span>
                                {k.trend}{" "}
                                <span className="text-gray-400 font-normal ml-1">
                                  dari 7 hari terakhir
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sales Chart + Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6">
                      {/* Main Sales Chart */}
                      <div className="col-span-1 lg:col-span-8 bg-white p-3 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-buddy-text-main">
                              Grafik Penjualan
                            </h3>
                            <p className="text-xs text-buddy-text-muted mt-0.5">
                              Total: Rp 128,3Jt
                            </p>
                          </div>
                          <select className="text-[10px] sm:text-xs bg-gray-50 border border-gray-200 rounded-lg py-1 px-3 outline-none">
                            <option>7 Hari Terakhir</option>
                          </select>
                        </div>
                        <div className="h-32 sm:h-64 relative mt-2 sm:mt-4">
                          <canvas ref={canvasRef} className="w-full h-full" />
                        </div>
                        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[8px] sm:text-[10px] text-gray-400 px-1">
                          <span>Senin</span>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-buddy-purple inline-block" />
                            <span className="font-semibold text-gray-500">
                              Omzet (Rp)
                            </span>
                          </div>
                          <span>Minggu</span>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="col-span-1 lg:col-span-4 bg-white p-3 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3 sm:mb-6">
                          <h3 className="text-xs sm:text-sm font-bold text-buddy-text-main">
                            Aktivitas Terbaru
                          </h3>
                          <span className="text-buddy-purple text-[10px] sm:text-xs font-bold hover:underline cursor-pointer">
                            Lihat semua
                          </span>
                        </div>
                        <ul className="space-y-2 sm:space-y-4">
                          <li className="flex items-start gap-2 sm:gap-3">
                            <div className="bg-blue-50 p-1.5 sm:p-2 rounded-xl text-blue-500">
                              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs font-medium text-buddy-text-main leading-snug truncate">
                                Order #ORD-8792 dari Dinda
                              </p>
                              <p className="text-[8px] sm:text-[10px] text-buddy-text-muted mt-0.5">
                                10:24
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <div className="bg-orange-50 p-1.5 sm:p-2 rounded-xl text-orange-500">
                              <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs font-medium text-buddy-text-main leading-snug truncate">
                                Produk Kopi Arabika stok rendah
                              </p>
                              <p className="text-[8px] sm:text-[10px] text-buddy-text-muted mt-0.5">
                                Sekarang
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          {BADGES.map((b, i) => (
            <div
              key={i}
              className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-buddy-purple/20 bg-white/80 backdrop-blur-md text-xs text-buddy-text-main font-medium shadow-xl"
              style={{
                top: b.top,
                left: b.left,
                right: b.right,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {b.text}
            </div>
          ))}

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-buddy-bg to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
