import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { generateText, isAIConfigured } from "@/lib/ai";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export interface AiRecommendation {
  id: string;
  type: string;       // e.g. "Strategi Bundling", "Promo Kilat", "Restock"
  title: string;
  description: string;
  impact: string;     // e.g. "+18% omzet", "kurangi stok menumpuk"
  actionLabel: string;
  actionUrl: string;
}

export interface RecommendationsResponse {
  recommendations: AiRecommendation[];
  generatedAt: string;
  source: "ai" | "fallback";
}

async function buildContext(storeId: string): Promise<string> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [topItems, lowStockItems, revenueAgg, customerCount] =
    await Promise.all([
      // Top 5 best-selling products (last 30 days)
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: { storeId, status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
        },
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      // Low/empty stock items
      prisma.inventoryItem.findMany({
        where: { product: { storeId }, status: { in: ["LOW", "EMPTY"] } },
        include: { product: { select: { name: true, price: true } } },
        take: 5,
      }),
      // Monthly revenue
      prisma.order.aggregate({
        where: { storeId, status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.customer.count({ where: { storeId } }),
    ]);

  // Resolve product names for top items
  const productIds = topItems.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, categoryId: true },
    ...(productIds.length === 0 ? { take: 0 } : {}),
  });

  const topProductsText =
    topItems.length > 0
      ? topItems
          .map((item) => {
            const p = products.find((p) => p.id === item.productId);
            return `- ${p?.name ?? "Produk"}: ${item._sum.quantity ?? 0} terjual, omzet Rp ${(item._sum.subtotal ?? 0).toLocaleString("id-ID")}`;
          })
          .join("\n")
      : "- Belum ada data penjualan";

  const lowStockText =
    lowStockItems.length > 0
      ? lowStockItems
          .map((i) => `- ${i.product.name} (status: ${i.status}, harga: Rp ${i.product.price.toLocaleString("id-ID")})`)
          .join("\n")
      : "- Semua stok normal";

  return `
DATA BISNIS 30 HARI TERAKHIR:
- Total Omzet: Rp ${(revenueAgg._sum.total ?? 0).toLocaleString("id-ID")}
- Total Transaksi: ${revenueAgg._count}
- Total Pelanggan: ${customerCount}

PRODUK TERLARIS:
${topProductsText}

STOK PERLU PERHATIAN:
${lowStockText}
`.trim();
}

function buildFallback(): AiRecommendation[] {
  return [
    {
      id: "fb-1",
      type: "Strategi Bundling",
      title: "Buat paket bundling produk terlaris",
      description:
        "Gabungkan 2 produk dengan penjualan tertinggi menjadi satu paket dengan harga spesial untuk meningkatkan nilai transaksi.",
      impact: "Estimasi +15% rata-rata nilai transaksi",
      actionLabel: "Buat Campaign",
      actionUrl: "/dashboard/campaign",
    },
    {
      id: "fb-2",
      type: "Restock Segera",
      title: "Cek dan restok produk yang hampir habis",
      description:
        "Beberapa produk stoknya sudah rendah. Lakukan restock sebelum kehabisan agar tidak kehilangan potensi penjualan.",
      impact: "Cegah kehilangan omzet akibat kehabisan stok",
      actionLabel: "Lihat Inventory",
      actionUrl: "/dashboard/inventory",
    },
    {
      id: "fb-3",
      type: "Retensi Pelanggan",
      title: "Kirim broadcast ke pelanggan lama",
      description:
        "Pelanggan yang sudah lama tidak membeli berpotensi kembali dengan promosi yang tepat.",
      impact: "Tingkatkan repeat order pelanggan",
      actionLabel: "Buat Broadcast",
      actionUrl: "/dashboard/broadcast",
    },
  ];
}

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    if (!isAIConfigured()) {
      const response: RecommendationsResponse = {
        recommendations: buildFallback(),
        generatedAt: new Date().toISOString(),
        source: "fallback",
      };
      return Response.json(response);
    }

    const context = await buildContext(storeId);

    const prompt = `Kamu adalah Buddy AI, asisten bisnis untuk UMKM Indonesia.

Berdasarkan data bisnis berikut, buat TEPAT 3 rekomendasi aksi yang konkret dan actionable.

${context}

INSTRUKSI FORMAT:
Balas HANYA dengan JSON array (tidak ada teks lain), setiap item memiliki field persis seperti ini:
[
  {
    "id": "rec-1",
    "type": "Tipe Rekomendasi (maks 3 kata)",
    "title": "Judul aksi konkret (maks 10 kata)",
    "description": "Penjelasan singkat kenapa dan bagaimana (maks 25 kata)",
    "impact": "Estimasi dampak bisnis singkat (maks 8 kata)",
    "actionLabel": "Label tombol (maks 3 kata)",
    "actionUrl": "/dashboard/campaign"
  }
]

Untuk actionUrl pilih salah satu yang relevan: /dashboard/campaign, /dashboard/broadcast, /dashboard/inventory, /dashboard/products, /dashboard/customers

BALAS HANYA JSON ARRAY:`;

    const text = await generateText(prompt);
    const jsonMatch = text.match(/\[[\s\S]*?\]/);

    if (!jsonMatch) {
      throw new Error("AI response tidak mengandung JSON array");
    }

    const parsed = JSON.parse(jsonMatch[0]) as AiRecommendation[];

    // Validate shape — must be an array with at least 1 item
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("AI response JSON tidak valid");
    }

    const response: RecommendationsResponse = {
      recommendations: parsed.slice(0, 3),
      generatedAt: new Date().toISOString(),
      source: "ai",
    };

    return Response.json(response);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("[AI Recommendations]", err);
    // Graceful degradation to fallback
    const response: RecommendationsResponse = {
      recommendations: buildFallback(),
      generatedAt: new Date().toISOString(),
      source: "fallback",
    };
    return Response.json(response);
  }
}
