import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.trim()?.toLowerCase() || "";

    if (q.length < 2) {
      return NextResponse.json({
        products: [],
        customers: [],
        orders: [],
        campaigns: [],
        broadcasts: [],
      });
    }

    const [products, customers, orders, campaigns, broadcasts] =
      await Promise.all([
        prisma.product.findMany({
          where: {
            storeId,
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, sku: true },
          take: 10,
        }),
        prisma.customer.findMany({
          where: {
            storeId,
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, email: true, phone: true },
          take: 10,
        }),
        prisma.order.findMany({
          where: {
            storeId,
            OR: [{ orderNumber: { contains: q, mode: "insensitive" } }],
          },
          select: { id: true, orderNumber: true, total: true, createdAt: true },
          take: 10,
        }),
        prisma.campaign.findMany({
          where: {
            storeId,
            OR: [{ name: { contains: q, mode: "insensitive" } }],
          },
          select: { id: true, name: true, status: true },
          take: 10,
        }),
        prisma.broadcast.findMany({
          where: {
            storeId,
            OR: [{ title: { contains: q, mode: "insensitive" } }],
          },
          select: { id: true, title: true, channel: true, status: true },
          take: 10,
        }),
      ]);

    return NextResponse.json({
      products,
      customers,
      orders,
      campaigns,
      broadcasts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
