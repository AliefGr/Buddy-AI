import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id, storeId },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return Response.json(order);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({ where: { id, storeId } });
    if (!order) {
      return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id, storeId },
      include: { items: { include: { product: { include: { inventory: true } } } } },
    });

    if (!order) {
      return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    if (order.status === "COMPLETED") {
      return Response.json(
        { error: "Order yang sudah selesai tidak bisa dihapus" },
        { status: 409 }
      );
    }

    await prisma.order.delete({ where: { id } });
    return Response.json({ message: "Order berhasil dihapus" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
