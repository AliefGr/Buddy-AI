import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { storeId } = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { storeId, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    select: { createdAt: true },
  });

  const heatmapData: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const day = (date.getDay() + 6) % 7; // Senin = 0, Minggu = 6
    const hour = date.getHours();
    heatmapData[day][hour]++;
  });

  return NextResponse.json({ heatmapData });
}
