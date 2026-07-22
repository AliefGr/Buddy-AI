import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateText, isAIConfigured } from "@/lib/ai";

export async function POST() {
  const { storeId } = await requireAuth();

  const customers = await prisma.customer.findMany({
    where: { storeId },
    include: { _count: { select: { orders: true } } },
    orderBy: { totalSpent: "desc" },
    take: 10,
  });

  const totalCustomers = await prisma.customer.count({ where: { storeId } });
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const prompt = `Anda adalah AI analis bisnis. Berikan 3 insight/prediksi/ rekomendasi tentang pelanggan toko berdasarkan data berikut (dalam bahasa Indonesia):
- Total pelanggan: ${totalCustomers}
- Total pendapatan dari pelanggan top 10: ${totalRevenue}
- Data top 10 pelanggan (nama, total spend, jumlah order):
${customers.map((c) => `- ${c.name}: Rp ${c.totalSpent.toLocaleString("id-ID")} (${c._count.orders} order)`).join("\n")}

Berikan jawaban dalam format JSON array dengan 3 object, masing-masing memiliki "text" (string), "action" (string), "color" (string: "purple", "amber", "blue"). JANGAN tambahkan teks apapun selain JSON array tersebut!`;

  try {
    if (!isAIConfigured()) {
      // Fallback jika AI tidak dikonfigurasi
      const fallbackInsights = [
        {
          text: `Total pelanggan Anda: ${totalCustomers}. Berikan program loyalitas untuk meningkatkan retensi.`,
          action: "Buat Program",
          color: "purple",
        },
        {
          text: `Top pelanggan belanja Rp ${totalRevenue.toLocaleString("id-ID")}. Berikan penawaran eksklusif.`,
          action: "Kirim Notif",
          color: "amber",
        },
        {
          text: "Pelanggan yang aktif belanja bisa dijadikan referensi. Coba buat program referral.",
          action: "Buat Offer",
          color: "blue",
        },
      ];
      return NextResponse.json({ insights: fallbackInsights });
    }

    const text = await generateText(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ insights });
    }
    throw new Error("Invalid JSON from AI");
  } catch (error) {
    // Fallback jika AI gagal
    console.error("[Customer Insight]", error);
    const fallbackInsights = [
      {
        text: `Total pelanggan Anda: ${totalCustomers}. Berikan program loyalitas untuk meningkatkan retensi.`,
        action: "Buat Program",
        color: "purple",
      },
      {
        text: `Top pelanggan belanja Rp ${totalRevenue.toLocaleString("id-ID")}. Berikan penawaran eksklusif.`,
        action: "Kirim Notif",
        color: "amber",
      },
      {
        text: "Pelanggan yang aktif belanja bisa dijadikan referensi. Coba buat program referral.",
        action: "Buat Offer",
        color: "blue",
      },
    ];
    return NextResponse.json({ insights: fallbackInsights });
  }
}
