import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      revenueThisMonth,
      revenueLastMonth,
      ordersThisMonth,
      ordersLastMonth,
      totalCustomers,
      newCustomersThisMonth,
      activeProducts,
      lowStockCount,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfMonth } },
      }),
      prisma.order.count({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      prisma.customer.count({ where: { storeId } }),
      prisma.customer.count({ where: { storeId, joinedAt: { gte: startOfMonth } } }),
      prisma.product.count({ where: { storeId, isActive: true } }),
      prisma.inventoryItem.count({
        where: { product: { storeId }, status: { in: ["LOW", "EMPTY"] } },
      }),
    ]);

    const rev = revenueThisMonth._sum.total ?? 0;
    const revLast = revenueLastMonth._sum.total ?? 0;
    const revTrend = revLast > 0 ? ((rev - revLast) / revLast) * 100 : 0;
    const orderTrend = ordersLastMonth > 0 ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100 : 0;

    return Response.json({
      revenue: { value: rev, trend: Math.round(revTrend * 10) / 10 },
      orders: { value: ordersThisMonth, trend: Math.round(orderTrend * 10) / 10 },
      customers: { total: totalCustomers, newThisMonth: newCustomersThisMonth },
      products: { active: activeProducts, lowStock: lowStockCount },
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
