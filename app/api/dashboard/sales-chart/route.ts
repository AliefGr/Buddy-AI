import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const days = parseInt(request.nextUrl.searchParams.get("days") ?? "7");
    const clampedDays = [7, 30].includes(days) ? days : 7;

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - clampedDays + 1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: { storeId, status: "COMPLETED", createdAt: { gte: startDate } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Build date map
    const dateMap: Record<string, number> = {};
    for (let i = 0; i < clampedDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = d.toISOString().split("T")[0];
      dateMap[key] = 0;
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().split("T")[0];
      if (key in dateMap) dateMap[key] += order.total;
    }

    const result = Object.entries(dateMap).map(([date, revenue]) => ({
      date,
      revenue,
      label: new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    }));

    return Response.json(result);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
