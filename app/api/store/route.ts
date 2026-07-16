import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

export async function GET() {
  try {
    const { storeId } = await requireAuth();
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, currency: true, timezone: true },
    });
    if (!store) return Response.json({ error: "Store tidak ditemukan" }, { status: 404 });
    return Response.json(store);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const body = await request.json();
    const parsed = z.object({
      name: z.string().min(1).max(100).optional(),
      currency: z.string().optional(),
      timezone: z.string().optional(),
    }).safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }
    const store = await prisma.store.update({
      where: { id: storeId },
      data: parsed.data,
    });
    return Response.json(store);
  } catch {
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
