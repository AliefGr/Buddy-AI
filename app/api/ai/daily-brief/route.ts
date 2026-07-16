import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { generateText, isGeminiConfigured } from "@/lib/gemini";

export async function POST() {
  try {
    const { storeId } = await requireAuth();

    if (!isGeminiConfigured()) {
      return Response.json({ error: "AI tidak dikonfigurasi" }, { status: 503 });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayOrders, monthRevenue, lowStock, newCustomers] = await Promise.all([
      prisma.order.findMany({
        where: { storeId, createdAt: { gte: startOfToday } },
        select: { total: true, status: true },
      }),
      prisma.order.aggregate({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.inventoryItem.count({
        where: { product: { storeId }, status: { in: ["LOW", "EMPTY"] } },
      }),
      prisma.customer.count({
        where: { storeId, joinedAt: { gte: startOfMonth } },
      }),
    ]);

    const todayRevenue = todayOrders
      .filter(o => o.status === "COMPLETED")
      .reduce((s, o) => s + o.total, 0);

    const prompt = `Buat daily brief singkat untuk pemilik UMKM dalam Bahasa Indonesia.
Format: 3-4 poin insight utama, setiap poin 1-2 kalimat, gunakan emoji.

DATA HARI INI (${now.toLocaleDateString("id-ID")}):
- Omzet hari ini: Rp ${todayRevenue.toLocaleString("id-ID")}
- Order hari ini: ${todayOrders.length}
- Omzet bulan ini: Rp ${(monthRevenue._sum.total ?? 0).toLocaleString("id-ID")} (${monthRevenue._count} transaksi)
- Item stok rendah/habis: ${lowStock}
- Pelanggan baru bulan ini: ${newCustomers}

Buat ringkasan yang motivatif, actionable, dan spesifik. Maksimal 150 kata.`;

    const brief = await generateText(prompt);

    // Cache result
    await prisma.aiInsight.create({
      data: {
        storeId,
        type: "DAILY_BRIEF",
        content: { brief, generatedAt: now.toISOString() },
      },
    });

    return Response.json({ brief });
  } catch (error) {
    console.error("[Daily Brief]", error);
    return Response.json({ error: "Gagal generate daily brief" }, { status: 500 });
  }
}
