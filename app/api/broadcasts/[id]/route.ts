import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "SCHEDULED", "SENT"]).optional(),
  recipients: z.number().int().min(0).optional(),
  readCount: z.number().int().min(0).optional(),
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
    if (!parsed.success) return Response.json({ error: "Validasi gagal" }, { status: 400 });
    const broadcast = await prisma.broadcast.findFirst({ where: { id, storeId } });
    if (!broadcast) return Response.json({ error: "Broadcast tidak ditemukan" }, { status: 404 });
    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "SENT") data.sentAt = new Date();
    const updated = await prisma.broadcast.update({ where: { id }, data });
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { storeId } = await requireAuth();
    const { id } = await params;
    const broadcast = await prisma.broadcast.findFirst({ where: { id, storeId } });
    if (!broadcast) return Response.json({ error: "Broadcast tidak ditemukan" }, { status: 404 });
    if (broadcast.status === "SENT") {
      return Response.json({ error: "Broadcast yang sudah terkirim tidak bisa dihapus" }, { status: 409 });
    }
    await prisma.broadcast.delete({ where: { id } });
    return Response.json({ message: "Broadcast dihapus" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
