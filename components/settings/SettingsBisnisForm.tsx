"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
  MessageSquare,
  Camera,
  Globe,
  Clock,
  Map,
  Hash,
  Image,
  MessageCircle,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface StoreData {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  logoUrl?: string | null;
  businessCategory?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  website?: string | null;
  operatingHours?: string | null;
  googleMapsLink?: string | null;
  npwp?: string | null;
}

const timezones = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"];
const currencies = ["IDR", "USD"];

export function SettingsBisnisForm() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [businessCategory, setBusinessCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [npwp, setNpwp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/store")
      .then((r) => r.json())
      .then((data) => {
        setStore(data);
        setName(data.name || "");
        setCurrency(data.currency || "IDR");
        setTimezone(data.timezone || "Asia/Jakarta");
        setLogoUrl(data.logoUrl || null);
        setBusinessCategory(data.businessCategory || "");
        setDescription(data.description || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setProvince(data.province || "");
        setPostalCode(data.postalCode || "");
        setPhone(data.phone || "");
        setWhatsapp(data.whatsapp || "");
        setInstagram(data.instagram || "");
        setFacebook(data.facebook || "");
        setTiktok(data.tiktok || "");
        setWebsite(data.website || "");
        setOperatingHours(data.operatingHours || "");
        setGoogleMapsLink(data.googleMapsLink || "");
        setNpwp(data.npwp || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currency,
          timezone,
          logoUrl,
          businessCategory: businessCategory || null,
          description: description || null,
          address: address || null,
          city: city || null,
          province: province || null,
          postalCode: postalCode || null,
          phone: phone || null,
          whatsapp: whatsapp || null,
          instagram: instagram || null,
          facebook: facebook || null,
          tiktok: tiktok || null,
          website: website || null,
          operatingHours: operatingHours || null,
          googleMapsLink: googleMapsLink || null,
          npwp: npwp || null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.avatarUrl);
      } else {
        alert("Gagal mengunggah logo");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Terjadi kesalahan saat mengunggah logo");
    } finally {
      setUploadingLogo(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12 gap-2 text-buddy-text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat data bisnis...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-bold text-buddy-text-main mb-6">Informasi Bisnis</h2>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 border-2 border-white shadow-md flex items-center justify-center">
              {uploadingLogo ? (
                <Loader2 className="w-6 h-6 text-buddy-purple animate-spin" />
              ) : logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Globe className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-buddy-purple rounded-xl flex items-center justify-center shadow-md hover:bg-buddy-purple/90 transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div>
            <p className="font-bold text-buddy-text-main">
              {name || "Nama Bisnis"}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
            Nama Bisnis
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Mata Uang
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm appearance-none pr-9 focus:outline-none"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Zona Waktu
            </label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm appearance-none pr-9 focus:outline-none"
              >
                {timezones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Kategori Bisnis
            </label>
            <input
              type="text"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="Misal: Makanan & Minuman"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              NPWP (Opsional)
            </label>
            <input
              type="text"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="12.345.678.9-012.345"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
            Deskripsi Bisnis
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none resize-none"
            placeholder="Deskripsi singkat tentang bisnis Anda"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Alamat Bisnis
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none resize-none"
            placeholder="Jalan Contoh No. 123"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Kota
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="Jakarta"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Provinsi
            </label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="DKI Jakarta"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5">
              Kode Pos
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="12345"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="021-1234567"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="628123456789"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Jam Operasional
            </label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="Senin - Jumat: 08:00 - 17:00"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
            <Map className="w-4 h-4" />
            Link Google Maps
          </label>
          <input
            type="url"
            value={googleMapsLink}
            onChange={(e) => setGoogleMapsLink(e.target.value)}
            className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Facebook
            </label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="fb.com/username"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-buddy-text-main block mb-1.5 flex items-center gap-2">
              <Music className="w-4 h-4" />
              TikTok
            </label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="input-field w-full px-4 py-3 bg-white border border-buddy-border rounded-xl text-sm focus:outline-none"
              placeholder="@username"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saved
              ? "Tersimpan ✓"
              : saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
