"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Users,
  TrendingUp,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Star,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  totalSpent: number;
  lastOrderAt: string | null;
  joinedAt: string;
  _count: { orders: number };
}

const tierConfig = {
  BRONZE: { label: "Bronze", className: "bg-orange-100 text-orange-700" },
  SILVER: { label: "Silver", className: "bg-gray-100 text-gray-600" },
  GOLD: { label: "Gold", className: "bg-amber-100 text-amber-700" },
  PLATINUM: { label: "Platinum", className: "bg-purple-100 text-purple-700" },
};

function formatRupiah(amount: number) {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}K`;
  return `Rp ${amount}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function AddCustomerModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    };
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal menambah pelanggan");
        return;
      }
      onSuccess();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-buddy-text-main">Tambah Pelanggan</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
              Nama *
            </label>
            <input
              name="name"
              required
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
              placeholder="Siti Rahayu"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
              placeholder="siti@gmail.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
              No. HP
            </label>
            <input
              name="phone"
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
              placeholder="08123456789"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="flex-1"
              loading={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AiInsight {
  text: string;
  action: string;
  color: "purple" | "amber" | "blue";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [aiLoading, setAiLoading] = useState(true);

  const fetchCustomers = useCallback(
    async (q = search) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("search", q);
        const res = await fetch(`/api/customers?${params}`);
        if (res.ok) setCustomers(await res.json());
      } finally {
        setLoading(false);
      }
    },
    [search],
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetch("/api/ai/customer-insight", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.insights) setAiInsights(data.insights);
      })
      .finally(() => setAiLoading(false));
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCustomers(search);
  }

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders = customers.reduce((s, c) => s + c._count.orders, 0);
  const newThisMonth = customers.filter((c) => {
    const joined = new Date(c.joinedAt);
    const now = new Date();
    return (
      joined.getMonth() === now.getMonth() &&
      joined.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      label: "Total Pelanggan",
      value: customers.length.toLocaleString("id-ID"),
      icon: <Users className="w-5 h-5" />,
      color: "bg-buddy-purple/10 text-buddy-purple",
    },
    {
      label: "Pelanggan Baru (Bulan Ini)",
      value: newThisMonth.toString(),
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Pesanan",
      value: totalOrders.toLocaleString("id-ID"),
      icon: <Heart className="w-5 h-5" />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      label: "Total Spending",
      value: formatRupiah(totalSpent),
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-buddy-text-main">Pelanggan</h1>
        <p className="text-sm text-buddy-text-muted">
          Kelola dan analisis data pelanggan bisnis Anda
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((s, idx) => (
          <Card key={idx} padding="md">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}
              >
                {s.icon}
              </div>
            </div>
            <p className="text-xl font-bold text-buddy-text-main leading-none">
              {s.value}
            </p>
            <p className="text-xs text-buddy-text-muted mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8">
          <Card padding="none" overflow>
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <h3 className="font-bold text-buddy-text-main">
                    Daftar Pelanggan
                  </h3>
                  <p className="text-xs text-buddy-text-muted mt-0.5">
                    {customers.length} pelanggan terdaftar
                  </p>
                </div>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle" />
                    <input
                      type="text"
                      placeholder="Cari pelanggan..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-buddy-border rounded-xl text-sm focus:outline-none focus:border-buddy-purple"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="gap-1.5 shrink-0"
                    onClick={() => setShowAdd(true)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah
                  </Button>
                </form>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Memuat pelanggan...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
                <Users className="w-8 h-8 opacity-30" />
                <p className="text-sm font-medium">Belum ada pelanggan</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2 gap-1.5"
                  onClick={() => setShowAdd(true)}
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Pelanggan
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {[
                          "Pelanggan",
                          "Bergabung",
                          "Pesanan",
                          "Total Spend",
                          "Tier",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider last:text-left"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => {
                        const t = tierConfig[c.tier];
                        return (
                          <tr
                            key={c.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-buddy-purple/10 flex items-center justify-center text-xs font-bold text-buddy-purple shrink-0">
                                  {getInitials(c.name)}
                                </div>
                                <div>
                                  <p className="font-semibold text-buddy-text-main">
                                    {c.name}
                                  </p>
                                  <p className="text-[11px] text-buddy-text-subtle">
                                    {c.email ?? c.phone ?? "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-buddy-text-muted text-xs">
                              {new Date(c.joinedAt).toLocaleDateString(
                                "id-ID",
                                { month: "short", year: "numeric" },
                              )}
                            </td>
                            <td className="px-6 py-4 font-semibold text-buddy-text-main">
                              {c._count.orders}
                            </td>
                            <td className="px-6 py-4 font-semibold text-buddy-text-main">
                              {formatRupiah(c.totalSpent)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.className}`}
                              >
                                {t.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden divide-y divide-gray-50">
                  {customers.map((c) => {
                    const t = tierConfig[c.tier];
                    return (
                      <div key={c.id} className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-buddy-purple/10 flex items-center justify-center text-xs font-bold text-buddy-purple shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-buddy-text-main text-sm truncate">
                              {c.name}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${t.className}`}
                            >
                              {t.label}
                            </span>
                          </div>
                          <p className="text-xs text-buddy-text-subtle truncate">
                            {c.email ?? c.phone ?? "—"}
                          </p>
                          <p className="text-xs text-buddy-text-muted mt-0.5">
                            {c._count.orders} pesanan ·{" "}
                            {formatRupiah(c.totalSpent)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-buddy-purple/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-buddy-purple" />
              </div>
              <div>
                <p className="font-bold text-buddy-text-main text-sm">
                  AI Insight Pelanggan
                </p>
                <p className="text-[10px] text-buddy-text-subtle">
                  Rekomendasi berdasarkan data
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {aiLoading ? (
                <div className="flex items-center justify-center py-4 gap-2 text-buddy-text-muted">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Menganalisis...</span>
                </div>
              ) : aiInsights.length === 0 ? (
                <p className="text-xs text-buddy-text-muted text-center py-4">
                  Belum ada insight
                </p>
              ) : (
                aiInsights.map((ins, idx) => {
                  const bgColor =
                    ins.color === "purple"
                      ? "bg-buddy-purple/5"
                      : ins.color === "amber"
                        ? "bg-amber-50"
                        : "bg-blue-50";
                  const textColor =
                    ins.color === "purple"
                      ? "text-buddy-purple"
                      : ins.color === "amber"
                        ? "text-amber-600"
                        : "text-blue-600";
                  return (
                    <div key={idx} className={`rounded-2xl p-4 ${bgColor}`}>
                      <p className="text-xs text-buddy-text-main leading-relaxed mb-2">
                        {ins.text}
                      </p>
                      <button
                        className={`text-[10px] font-bold flex items-center gap-1 hover:underline ${textColor}`}
                      >
                        {ins.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-buddy-text-main mb-3">
                Top Pelanggan
              </p>
              {topCustomers.length === 0 ? (
                <p className="text-xs text-buddy-text-muted">Belum ada data</p>
              ) : (
                topCustomers.map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 mb-3 last:mb-0"
                  >
                    <span className="text-xs font-bold text-buddy-text-subtle w-4">
                      {idx + 1}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-buddy-purple/10 flex items-center justify-center text-[10px] font-bold text-buddy-purple shrink-0">
                      {getInitials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-buddy-text-main truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-buddy-text-subtle">
                        {formatRupiah(c.totalSpent)}
                      </p>
                    </div>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchCustomers();
          }}
        />
      )}
    </>
  );
}
