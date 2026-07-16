import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    const orders = await prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        customer: { select: { name: true } },
        items: { select: { quantity: true } },
      },
    });

    return Response.json(orders);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
