import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;

    const item = await prisma.inventoryItem.findFirst({
      where: { id, product: { storeId } },
    });

    if (!item) {
      return Response.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    const movements = await prisma.stockMovement.findMany({
      where: { inventoryItemId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Response.json(movements);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
