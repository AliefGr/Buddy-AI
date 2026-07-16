import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().optional(),
});

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
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }
    const category = await prisma.category.findFirst({
      where: { id, storeId },
    });
    if (!category) {
      return Response.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    const updated = await prisma.category.update({
      where: { id },
      data: parsed.data,
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
    const category = await prisma.category.findFirst({
      where: { id, storeId },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      return Response.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    if (category._count.products > 0) {
      return Response.json(
        { error: `Tidak bisa dihapus, masih ada ${category._count.products} produk di kategori ini` },
        { status: 409 }
      );
    }
    await prisma.category.delete({ where: { id } });
    return Response.json({ message: "Kategori berhasil dihapus" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
