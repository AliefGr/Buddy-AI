import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    const items = await prisma.inventoryItem.findMany({
      where: { product: { storeId } },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: { select: { name: true, color: true } },
            isActive: true,
          },
        },
      },
      orderBy: { status: "asc" },
    });

    return Response.json(items);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
