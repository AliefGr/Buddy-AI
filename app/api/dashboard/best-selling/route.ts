import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    const topItems = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { storeId, status: "COMPLETED" } },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const products = await prisma.product.findMany({
      where: { id: { in: topItems.map(i => i.productId) } },
      select: { id: true, name: true, imageUrl: true },
    });

    const result = topItems.map((item, idx) => {
      const product = products.find(p => p.id === item.productId);
      return {
        rank: idx + 1,
        productId: item.productId,
        name: product?.name ?? "Unknown",
        imageUrl: product?.imageUrl ?? null,
        totalSold: item._sum.quantity ?? 0,
        totalRevenue: item._sum.subtotal ?? 0,
      };
    });

    return Response.json(result);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
