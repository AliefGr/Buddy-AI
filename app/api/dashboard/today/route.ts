import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(startOfToday);
    endOfYesterday.setMilliseconds(-1);

    const [todayAgg, yesterdayAgg, todayOrders, todayItems] = await Promise.all([
      prisma.order.aggregate({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfToday } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfYesterday, lte: endOfYesterday } },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { storeId, status: "COMPLETED", createdAt: { gte: startOfToday } },
      }),
      prisma.orderItem.aggregate({
        where: { order: { storeId, status: "COMPLETED", createdAt: { gte: startOfToday } } },
        _sum: { quantity: true },
      }),
    ]);

    const todayRevenue = todayAgg._sum.total ?? 0;
    const yesterdayRevenue = yesterdayAgg._sum.total ?? 0;
    const revTrend = yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 1000) / 10
      : 0;

    return Response.json({
      revenue: todayRevenue,
      revenueTrend: revTrend,
      orders: todayOrders,
      itemsSold: todayItems._sum.quantity ?? 0,
      avgOrder: todayOrders > 0 ? Math.round(todayRevenue / todayOrders) : 0,
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
