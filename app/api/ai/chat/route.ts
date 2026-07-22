import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { generateText, isAIConfigured } from "@/lib/ai";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "ai"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});

async function buildBusinessContext(storeId: string): Promise<string> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  interface TopProduct {
    productId: string | null;
    _sum: { quantity: number | null };
  }

  const [
    revenueAgg,
    ordersToday,
    lowStockItems,
    topProductsUncast,
    recentOrders,
    totalCustomers,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { storeId, status: "COMPLETED", createdAt: { gte: startOfMonth } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count({
      where: { storeId, status: "COMPLETED", createdAt: { gte: startOfToday } },
    }),
    prisma.inventoryItem.findMany({
      where: { product: { storeId }, status: { in: ["LOW", "EMPTY"] } },
      include: { product: { select: { name: true } } },
      take: 5,
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { storeId, status: "COMPLETED" } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    }),
    prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        orderNumber: true,
        total: true,
        createdAt: true,
        customer: { select: { name: true } },
      },
    }),
    prisma.customer.count({ where: { storeId } }),
  ]);

  const topProducts = topProductsUncast as unknown as TopProduct[];

  const topProductIds = topProducts
    .map((p: TopProduct) => p.productId)
    .filter((id): id is string => id !== null);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, price: true },
  });

  const topProductsText = topProducts
    .map((p: TopProduct) => {
      if (!p.productId) return null;
      const detail = topProductDetails.find((d) => d.id === p.productId);
      const quantity = p._sum.quantity ?? 0;
      return `${detail?.name ?? "Unknown"} (${quantity} terjual)`;
    })
    .filter((text): text is string => text !== null)
    .join(", ");

  const lowStockText =
    lowStockItems.length > 0
      ? lowStockItems.map((i) => `${i.product.name} (${i.status})`).join(", ")
      : "Semua stok dalam kondisi normal";

  const recentOrdersText = recentOrders
    .map(
      (o) =>
        `${o.orderNumber}: Rp ${o.total.toLocaleString("id-ID")} (${o.customer?.name ?? "Walk-in"})`,
    )
    .join("\n");

  return `
=== DATA BISNIS REAL-TIME ===
Tanggal: ${now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

KEUANGAN BULAN INI:
- Total Omzet: Rp ${(revenueAgg._sum.total ?? 0).toLocaleString("id-ID")}
- Total Transaksi: ${revenueAgg._count}
- Order Hari Ini: ${ordersToday}

PELANGGAN:
- Total Pelanggan: ${totalCustomers}

PRODUK TERLARIS:
${topProductsText || "Belum ada data penjualan"}

STOK PERLU PERHATIAN:
${lowStockText}

5 TRANSAKSI TERAKHIR:
${recentOrdersText || "Belum ada transaksi"}
=== END DATA ===
`.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();

    if (!isAIConfigured()) {
      return Response.json(
        { error: "AI belum dikonfigurasi. Tambahkan GROQ_API_KEY di .env" },
        { status: 503 },
      );
    }
    console.log("API KEY:", process.env.GROQ_API_KEY?.slice(0, 10));

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Input tidak valid" }, { status: 400 });
    }

    const { message, history } = parsed.data;
    const businessContext = await buildBusinessContext(storeId);

    const historyText =
      history.length > 0
        ? "\n\nRIWAYAT PERCAKAPAN:\n" +
          history
            .slice(-6)
            .map(
              (h) => `${h.role === "user" ? "User" : "Buddy AI"}: ${h.content}`,
            )
            .join("\n")
        : "";

    const prompt = `Kamu adalah Buddy AI, asisten bisnis cerdas untuk UMKM Indonesia.
Kamu membantu pemilik usaha menganalisis data bisnis, memberikan insight, dan rekomendasi actionable.

INSTRUKSI:
- Jawab dalam Bahasa Indonesia yang ramah dan profesional
- Berikan insight yang spesifik berdasarkan data nyata yang tersedia
- Sertakan angka dan rekomendasi konkret
- Gunakan emoji secukupnya untuk keterbacaan
- Jika pertanyaan tidak berkaitan bisnis, arahkan kembali ke topik bisnis

${businessContext}
${historyText}

PERTANYAAN USER: ${message}

JAWABAN BUDDY AI:`;

    const response = await generateText(prompt);

    // Save to conversation history
    await prisma.aiConversation.createMany({
      data: [
        { storeId, role: "USER", content: message },
        { storeId, role: "ASSISTANT", content: response },
      ],
    });

    return Response.json({ response });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[AI Chat]", error);
    return Response.json(
      { error: "Gagal mendapatkan respons AI", detail: msg },
      { status: 500 },
    );
  }
}
