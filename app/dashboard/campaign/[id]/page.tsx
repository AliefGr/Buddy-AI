"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  MessageSquare,
  Mail,
  Phone,
  Camera,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Campaign {
  id: string;
  name: string;
  objective: string | null;
  description: string | null;
  targetCustomer: string | null;
  promotionType: string | null;
  promotionValue: number | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "FINISHED";
  broadcasts: Broadcast[];
  _count?: { broadcasts: number };
}

interface Broadcast {
  id: string;
  title: string;
  channel: "WHATSAPP" | "EMAIL" | "SMS" | "INSTAGRAM";
  status: "DRAFT" | "SCHEDULED" | "SENT";
  content: string;
  targetCustomer: string | null;
  totalTarget: number;
  successCount: number;
  failedCount: number;
  deliveredCount: number;
  readCount: number;
  clickCount: number;
  scheduledAt: Date | string | null;
  sentAt: Date | string | null;
  createdAt: Date | string;
}

const statusMap = {
  ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-700" },
  SCHEDULED: { label: "Terjadwal", color: "bg-amber-100 text-amber-700" },
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  FINISHED: { label: "Selesai", color: "bg-blue-100 text-blue-700" },
};

const broadcastStatusMap = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  SCHEDULED: { label: "Terjadwal", color: "bg-amber-100 text-amber-700" },
  SENT: { label: "Terkirim", color: "bg-green-100 text-green-700" },
};

const channelIconMap = {
  WHATSAPP: MessageSquare,
  EMAIL: Mail,
  SMS: Phone,
  INSTAGRAM: Camera,
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

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddBroadcastModal, setShowAddBroadcastModal] = useState(false);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${params.id}`);
      if (res.ok) setCampaign(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchCampaign();
  }, [params.id]);

  const totalBroadcasts = campaign?.broadcasts.length || 0;
  const totalSent =
    campaign?.broadcasts.reduce(
      (sum, b) => sum + (b.status === "SENT" ? b.deliveredCount : 0),
      0,
    ) || 0;
  const totalSuccess =
    campaign?.broadcasts.reduce(
      (sum, b) => sum + (b.status === "SENT" ? b.successCount : 0),
      0,
    ) || 0;
  const totalFailed =
    campaign?.broadcasts.reduce(
      (sum, b) => sum + (b.status === "SENT" ? b.failedCount : 0),
      0,
    ) || 0;

  const handleSendBroadcast = async (id: string) => {
    const res = await fetch(`/api/broadcasts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SENT" }),
    });
    if (res.ok) fetchCampaign();
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={() => router.push("/dashboard/campaign")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        {loading ? (
          <div className="flex items-center gap-2 text-buddy-text-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memuat...</span>
          </div>
        ) : campaign ? (
          <div>
            <h1 className="text-2xl font-bold text-buddy-text-main">
              {campaign.name}
            </h1>
            <p className="text-sm text-buddy-text-muted">Detail campaign</p>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat campaign...</span>
        </div>
      ) : campaign ? (
        <>
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    statusMap[campaign.status as keyof typeof statusMap].color
                  }`}
                >
                  {statusMap[campaign.status as keyof typeof statusMap].label}
                </span>
                {campaign.targetCustomer && (
                  <span className="text-[11px] text-buddy-text-subtle">
                    Target:{" "}
                    {audienceLabels[
                      campaign.targetCustomer as keyof typeof audienceLabels
                    ] || campaign.targetCustomer}
                  </span>
                )}
              </div>
              {campaign.startDate && (
                <span className="text-xs text-buddy-text-muted">
                  {new Date(campaign.startDate).toLocaleDateString("id-ID")} -{" "}
                  {campaign.endDate
                    ? new Date(campaign.endDate).toLocaleDateString("id-ID")
                    : ""}
                </span>
              )}
            </div>
            {campaign.objective && (
              <p className="text-sm text-buddy-text-muted mb-2">
                {campaign.objective}
              </p>
            )}
            {campaign.description && (
              <p className="text-sm text-buddy-text-subtle">
                {campaign.description}
              </p>
            )}
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card padding="md">
              <p className="text-xs text-buddy-text-muted mb-1">
                Total Broadcast
              </p>
              <p className="text-2xl font-bold text-buddy-text-main">
                {totalBroadcasts}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs text-buddy-text-muted mb-1">
                Total Terkirim
              </p>
              <p className="text-2xl font-bold text-green-600">
                {totalSent.toLocaleString("id-ID")}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs text-buddy-text-muted mb-1">Berhasil</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalSuccess.toLocaleString("id-ID")}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs text-buddy-text-muted mb-1">Gagal</p>
              <p className="text-2xl font-bold text-red-500">
                {totalFailed.toLocaleString("id-ID")}
              </p>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-buddy-text-main">Broadcast</h2>
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onClick={() => setShowAddBroadcastModal(true)}
            >
              <Plus className="w-4 h-4" /> Tambah Broadcast
            </Button>
          </div>

          <div className="space-y-3">
            {campaign.broadcasts.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-12 gap-2 text-buddy-text-muted">
                <p className="text-sm font-medium">
                  Belum ada broadcast untuk campaign ini
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2 gap-1.5"
                  onClick={() => setShowAddBroadcastModal(true)}
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Broadcast Pertama
                </Button>
              </Card>
            ) : (
              campaign.broadcasts.map((broadcast) => {
                const ChannelIcon =
                  channelIconMap[
                    broadcast.channel as keyof typeof channelIconMap
                  ];
                const status =
                  broadcastStatusMap[
                    broadcast.status as keyof typeof broadcastStatusMap
                  ];
                return (
                  <Card key={broadcast.id} padding="md">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          broadcast.channel === "WHATSAPP"
                            ? "bg-green-100 text-green-600"
                            : broadcast.channel === "EMAIL"
                              ? "bg-blue-100 text-blue-600"
                              : broadcast.channel === "INSTAGRAM"
                                ? "bg-pink-100 text-pink-600"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <ChannelIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-buddy-text-main text-sm">
                            {broadcast.title}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-buddy-text-subtle line-clamp-2 mb-2">
                          {broadcast.content}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap text-xs text-buddy-text-muted">
                          {broadcast.targetCustomer && (
                            <span>
                              Audience:{" "}
                              {audienceLabels[
                                broadcast.targetCustomer as keyof typeof audienceLabels
                              ] || broadcast.targetCustomer}
                            </span>
                          )}
                          {broadcast.totalTarget > 0 && (
                            <span>
                              {broadcast.totalTarget.toLocaleString("id-ID")}{" "}
                              penerima
                            </span>
                          )}
                          {broadcast.scheduledAt && (
                            <span>
                              Dijadwalkan:{" "}
                              {new Date(broadcast.scheduledAt).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                          )}
                          {broadcast.sentAt && (
                            <span>
                              Terkirim:{" "}
                              {new Date(broadcast.sentAt).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                          )}
                        </div>
                        {broadcast.status === "SENT" && (
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="text-green-600">
                              ✔️ Berhasil:{" "}
                              {broadcast.successCount.toLocaleString("id-ID")}
                            </span>
                            <span className="text-red-500">
                              ❌ Gagal:{" "}
                              {broadcast.failedCount.toLocaleString("id-ID")}
                            </span>
                            <span className="text-blue-500">
                              📦 Terkirim:{" "}
                              {broadcast.deliveredCount.toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                      </div>
                      {broadcast.status === "DRAFT" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleSendBroadcast(broadcast.id)}
                        >
                          Kirim
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {showAddBroadcastModal && (
            <AddBroadcastModal
              campaignId={campaign.id}
              onClose={() => setShowAddBroadcastModal(false)}
              onSuccess={() => {
                setShowAddBroadcastModal(false);
                fetchCampaign();
              }}
            />
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
          <p className="text-sm font-medium">Campaign tidak ditemukan</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-2"
            onClick={() => router.push("/dashboard/campaign")}
          >
            Kembali ke Daftar Campaign
          </Button>
        </Card>
      )}
    </>
  );
}

function AddBroadcastModal({
  campaignId,
  onClose,
  onSuccess,
}: {
  campaignId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("WHATSAPP");
  const [content, setContent] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("ALL");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/broadcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        channel,
        content,
        campaignId,
        targetCustomer,
        scheduledAt: scheduledAt || null,
      }),
    });
    if (res.ok) onSuccess();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-bold text-buddy-text-main">Buat Broadcast</h2>
          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
              Judul Broadcast *
            </label>
            <input
              type="text"
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Promo Spesial"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
              Channel *
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="INSTAGRAM">Instagram</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-buddy-text-muted block mb-1.5">
              Konten *
            </label>
            <textarea
              rows={4}
              className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Halo {nama}, ada promo spesial untukmu!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
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
                Jadwal (Opsional)
              </label>
              <input
                type="datetime-local"
                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
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
