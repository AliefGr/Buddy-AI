import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  phone: z.string().max(20).optional().or(z.literal("")).nullable(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;

    const customer = await prisma.customer.findFirst({
      where: { id, storeId },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        _count: { select: { orders: true } },
      },
    });

    if (!customer) {
      return Response.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 });
    }

    return Response.json(customer);
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
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({ where: { id, storeId } });
    if (!customer) {
      return Response.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...parsed.data,
        email: parsed.data.email === "" ? null : parsed.data.email,
        phone: parsed.data.phone === "" ? null : parsed.data.phone,
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

    const customer = await prisma.customer.findFirst({
      where: { id, storeId },
      include: { _count: { select: { orders: true } } },
    });

    if (!customer) {
      return Response.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 });
    }

    if (customer._count.orders > 0) {
      return Response.json(
        { error: `Tidak bisa dihapus, pelanggan ini memiliki ${customer._count.orders} riwayat order` },
        { status: 409 }
      );
    }

    await prisma.customer.delete({ where: { id } });
    return Response.json({ message: "Pelanggan berhasil dihapus" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
