"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  Plus,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Campaign {
  id: string;
  name: string;
  objective: string | null;
  targetCustomer: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "FINISHED";
  createdAt: Date | string;
  _count?: { broadcasts: number };
  broadcasts?: Array<{
    id: string;
    status: string;
    deliveredCount: number;
    successCount: number;
    totalTarget: number;
  }>;
}

const statusMap = {
  ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-700" },
  SCHEDULED: { label: "Terjadwal", color: "bg-amber-100 text-amber-700" },
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  FINISHED: { label: "Selesai", color: "bg-blue-100 text-blue-700" },
};

const audienceLabels = {
  ALL: "Semua Pelanggan",
  GOLD: "Member Gold",
  SILVER: "Member Silver",
  BRONZE: "Member Bronze",
  NEW: "Pelanggan Baru",
  INACTIVE: "Tidak Belanja &gt;30 Hari",
  TOP: "Top Customer",
};

export default function CampaignPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | Campaign["status"]>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) setCampaigns(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns =
    filter === "ALL" ? campaigns : campaigns.filter((c) => c.status === filter);

  const totalActive = campaigns.filter((c) => c.status === "ACTIVE").length;
  const totalSent = campaigns.reduce(
    (sum, c) =>
      sum +
      (c.broadcasts?.reduce(
        (bSum, b) => bSum + (b.status === "SENT" ? b.deliveredCount || 0 : 0),
        0,
      ) || 0),
    0,
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Anda yakin ingin menghapus campaign ini?")) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) fetchCampaigns();
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-buddy-text-main">Campaign</h1>
          <p className="text-sm text-buddy-text-muted">
            Kelola dan pantau semua campaign marketing Anda
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="gap-2 self-start sm:self-auto"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" /> Buat Campaign
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card padding="md">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-purple-700" />
          </div>
          <p className="text-2xl font-bold text-buddy-text-main">
            {totalActive}
          </p>
          <p className="text-xs text-buddy-text-muted mt-1">Campaign Aktif</p>
        </Card>
        <Card padding="md">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-green-700" />
          </div>
          <p className="text-2xl font-bold text-buddy-text-main">
            {totalSent.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-buddy-text-muted mt-1">Total Terkirim</p>
        </Card>
        <Card padding="md">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-blue-700" />
          </div>
          <p className="text-2xl font-bold text-buddy-text-main">
            {campaigns.length}
          </p>
          <p className="text-xs text-buddy-text-muted mt-1">Total Campaign</p>
        </Card>
        <Card padding="md">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-2xl font-bold text-buddy-text-main">
            {campaigns.filter((c) => c.status === "DRAFT").length}
          </p>
          <p className="text-xs text-buddy-text-muted mt-1">Draft</p>
        </Card>
      </div>

      <Card padding="none" overflow>
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="font-bold text-buddy-text-main flex-1">
              Semua Campaign
            </h3>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {["ALL", "ACTIVE", "SCHEDULED", "DRAFT", "FINISHED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as "ALL" | Campaign["status"])}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    filter === f
                      ? "bg-white text-buddy-purple shadow-sm"
                      : "text-buddy-text-muted hover:text-buddy-text-main"
                  }`}
                >
                  {f === "ALL"
                    ? "Semua"
                    : statusMap[f as keyof typeof statusMap].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat...</span>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
            <Target className="w-8 h-8 opacity-30" />
            <p className="text-sm font-medium">Belum ada campaign</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-2 gap-1.5"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Buat Campaign Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider">
                    Target
                  </th>
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider">
                    Broadcast
                  </th>
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider">
                    Terkirim
                  </th>
                  <th className="text-right px-6 py-3 text-[10px] font-bold text-buddy-text-subtle uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCampaigns.map((campaign) => {
                  const status =
                    statusMap[campaign.status as keyof typeof statusMap];
                  const sentCount =
                    campaign.broadcasts?.reduce(
                      (sum, b) =>
                        sum + (b.status === "SENT" ? b.deliveredCount || 0 : 0),
                      0,
                    ) || 0;
                  return (
                    <tr
                      key={campaign.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center text-base shrink-0">
                            📣
                          </div>
                          <div>
                            <p className="font-semibold text-buddy-text-main">
                              {campaign.name}
                            </p>
                            {campaign.targetCustomer && (
                              <p className="text-[11px] text-buddy-text-subtle">
                                {audienceLabels[
                                  campaign.targetCustomer as keyof typeof audienceLabels
                                ] || campaign.targetCustomer}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-buddy-text-muted">
                        {campaign.startDate && (
                          <span className="text-xs">
                            {new Date(campaign.startDate).toLocaleDateString(
                              "id-ID",
                            )}{" "}
                            -{" "}
                            {campaign.endDate
                              ? new Date(campaign.endDate).toLocaleDateString(
                                  "id-ID",
                                )
                              : ""}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-buddy-text-main">
                        {campaign._count?.broadcasts || 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-buddy-text-main">
                        {sentCount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-8 w-8"
                            onClick={() =>
                              router.push(`/dashboard/campaign/${campaign.id}`)
                            }
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-8 w-8"
                            onClick={() => console.log("Edit")}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showAddModal && (
        <AddCampaignModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCampaigns();
          }}
        />
      )}
    </>
  );
}

function AddCampaignModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("ALL");
  const [status, setStatus] = useState<Campaign["status"]>("DRAFT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        objective,
        targetCustomer,
        status,
        startDate: startDate || null,
        endDate: endDate || null,
      }),
    });
    if (res.ok) onSuccess();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-bold text-buddy-text-main">Buat Campaign Baru</h2>
          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
              Nama Campaign *
            </label>
            <input
              type="text"
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Promo Lebaran"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
              Tujuan Campaign
            </label>
            <textarea
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tingkatkan penjualan..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
                Target Audience
              </label>
              <select
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Semua Pelanggan</option>
                <option value="GOLD">Member Gold</option>
                <option value="SILVER">Member Silver</option>
                <option value="BRONZE">Member Bronze</option>
                <option value="NEW">Pelanggan Baru</option>
                <option value="INACTIVE">Tidak Belanja &gt;30 Hari</option>
                <option value="TOP">Top Customer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
                Status Campaign
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Campaign["status"])
                }
                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Aktif</option>
                <option value="SCHEDULED">Terjadwal</option>
                <option value="FINISHED">Selesai</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
                Tanggal Mulai
              </label>
              <input
                type="date"
                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
                Tanggal Selesai
              </label>
              <input
                type="date"
                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
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
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
