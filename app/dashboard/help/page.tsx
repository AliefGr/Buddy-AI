"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  BookOpen,
  ShoppingCart,
  Users,
  Megaphone,
  Radio,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: { title: string; content: string }[];
}

const helpSections: HelpSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      {
        title: "Panduan Dasar Penggunaan",
        content: "Selamat datang di Buddy! Di sini Anda dapat mengelola produk, pelanggan, pesanan, dan campaign marketing dengan mudah.",
      },
    ],
  },
  {
    id: "products",
    title: "Produk & Inventaris",
    icon: <ShoppingCart className="w-5 h-5" />,
    items: [
      {
        title: "Cara Menambah Produk",
        content: "Buka halaman Produk, klik tombol Tambah Produk, isi semua informasi produk, lalu simpan.",
      },
      {
        title: "Cara Mengelola Stok",
        content: "Di halaman Inventaris, Anda dapat melihat stok produk yang tersisa dan melakukan restok.",
      },
    ],
  },
  {
    id: "customers",
    title: "Pelanggan",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        title: "Cara Menambah Pelanggan",
        content: "Buka halaman Pelanggan, klik tombol Tambah Pelanggan, isi data pelanggan, lalu simpan.",
      },
    ],
  },
  {
    id: "campaigns",
    title: "Campaign",
    icon: <Megaphone className="w-5 h-5" />,
    items: [
      {
        title: "Cara Membuat Campaign",
        content: "Buka halaman Campaign, klik tombol Buat Campaign, isi informasi campaign, lalu simpan.",
      },
    ],
  },
  {
    id: "broadcasts",
    title: "Broadcast",
    icon: <Radio className="w-5 h-5" />,
    items: [
      {
        title: "Cara Mengirim Broadcast",
        content: "Buka halaman Broadcast, pilih campaign yang ingin digunakan, pilih channel, lalu kirim.",
      },
    ],
  },
  {
    id: "ai",
    title: "AI Assistant",
    icon: <HelpCircle className="w-5 h-5" />,
    items: [
      {
        title: "Cara Menggunakan AI Assistant",
        content: "Buka halaman AI Assistant, tuliskan pertanyaan atau permintaan Anda, lalu AI akan membantu Anda.",
      },
    ],
  },
];

const faqItems = [
  { question: "Bagaimana cara mengintegrasikan WhatsApp Business?", answer: "Buka Pengaturan > Integrasi, lalu masukkan Phone Number ID dan Access Token Anda." },
  { question: "Apakah data saya aman?", answer: "Ya, kami menjaga keamanan data Anda dengan enkripsi dan kebijakan privasi yang ketat." },
];

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pusat Bantuan</h1>
        <p className="text-gray-500 mt-1">Temukan jawaban untuk pertanyaan Anda di sini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {helpSections.map((section) => (
            <Card key={section.id}>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    {section.icon}
                  </div>
                  <h2 className="font-semibold text-gray-900">{section.title}</h2>
                </div>
                {openSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {openSection === section.id && (
                <div className="pb-4 space-y-4">
                  {section.items.map((item, index) => (
                    <div key={index} className="border-l-4 border-purple-200 pl-4">
                      <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card>
            <h2 className="font-bold text-gray-900 mb-4">FAQ</h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between py-2 text-left"
                  >
                    <span className="text-sm font-medium text-gray-900">{item.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {openFaq === index && (
                    <p className="text-sm text-gray-600 mt-2">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorial</h3>
            <p className="text-sm text-gray-500 mb-4">Segera hadir! Video tutorial untuk membantu Anda menggunakan Buddy.</p>
            <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-400 text-sm">Coming Soon</span>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">Hubungi Support</h3>
            <p className="text-sm text-gray-500 mb-4">Butuh bantuan lebih lanjut? Hubungi kami.</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">📧</span>
                <span className="text-gray-600">support@buddy.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">💬</span>
                <span className="text-gray-600">+62 812-3456-7890</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
