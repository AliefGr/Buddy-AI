import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  reach: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
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
    const campaign = await prisma.campaign.findFirst({ where: { id, storeId } });
    if (!campaign) return Response.json({ error: "Campaign tidak ditemukan" }, { status: 404 });
    const updated = await prisma.campaign.update({ where: { id }, data: parsed.data });
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
    const campaign = await prisma.campaign.findFirst({ where: { id, storeId } });
    if (!campaign) return Response.json({ error: "Campaign tidak ditemukan" }, { status: 404 });
    await prisma.campaign.delete({ where: { id } });
    return Response.json({ message: "Campaign dihapus" });
  } catch {
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
