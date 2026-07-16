import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const restockSchema = z.object({
  inventoryItemId: z.string().min(1),
  quantity: z.number().int().positive("Jumlah restock harus lebih dari 0"),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const body = await request.json();
    const parsed = restockSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { inventoryItemId, quantity, note } = parsed.data;

    // Verify ownership
    const item = await prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, product: { storeId } },
    });

    if (!item) {
      return Response.json({ error: "Item inventory tidak ditemukan" }, { status: 404 });
    }

    const newStock = item.currentStock + quantity;

    // Determine new status
    const newStatus =
      newStock === 0 ? "EMPTY" : newStock < item.minStock ? "LOW" : "NORMAL";

    const [updatedItem, movement] = await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: inventoryItemId },
        data: {
          currentStock: newStock,
          status: newStatus,
          lastRestockedAt: new Date(),
        },
        include: {
          product: { select: { name: true, sku: true } },
        },
      }),
      prisma.stockMovement.create({
        data: {
          inventoryItemId,
          type: "IN",
          quantity,
          note: note ?? `Restock ${quantity} unit`,
        },
      }),
    ]);

    return Response.json({ item: updatedItem, movement }, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
