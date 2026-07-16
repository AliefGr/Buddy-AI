import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  categoryId: z.string().min(1).optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.number().int().min(0).optional(),
  costPrice: z.number().int().min(0).optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id, storeId },
      include: {
        category: true,
        inventory: { include: { stockMovements: { orderBy: { createdAt: "desc" }, take: 10 } } },
        _count: { select: { orderItems: true } },
      },
    });
    if (!product) {
      return Response.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return Response.json(product);
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
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const product = await prisma.product.findFirst({ where: { id, storeId } });
    if (!product) {
      return Response.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }
    if (parsed.data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: parsed.data.categoryId, storeId },
      });
      if (!category) {
        return Response.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
      }
    }
    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: {
        category: { select: { id: true, name: true, color: true } },
        inventory: { select: { currentStock: true, status: true } },
      },
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
    const product = await prisma.product.findFirst({
      where: { id, storeId },
      include: { _count: { select: { orderItems: true } } },
    });
    if (!product) {
      return Response.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }
    if (product._count.orderItems > 0) {
      // Soft delete — deactivate instead
      await prisma.product.update({ where: { id }, data: { isActive: false } });
      return Response.json({ message: "Produk dinonaktifkan karena sudah pernah dijual" });
    }
    await prisma.product.delete({ where: { id } });
    return Response.json({ message: "Produk berhasil dihapus" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
