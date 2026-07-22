import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "FINISHED"]).optional(),
  objective: z.string().optional(),
  description: z.string().optional(),
  targetCustomer: z.string().optional(),
  promotionType: z.string().optional(),
  promotionValue: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findFirst({
      where: { id, storeId },
      include: {
        broadcasts: true,
        _count: { select: { broadcasts: true } },
      },
    });
    if (!campaign)
      return Response.json(
        { error: "Campaign tidak ditemukan" },
        { status: 404 },
      );
    return Response.json(campaign);
  } catch (error) {
    console.error("/api/campaigns/[id] GET error:", error);
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success)
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    const campaign = await prisma.campaign.findFirst({
      where: { id, storeId },
    });
    if (!campaign)
      return Response.json(
        { error: "Campaign tidak ditemukan" },
        { status: 404 },
      );
    const updated = await prisma.campaign.update({
      where: { id },
      data: parsed.data,
    });
    return Response.json(updated);
  } catch (error) {
    console.error("/api/campaigns/[id] PATCH error:", error);
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findFirst({
      where: { id, storeId },
    });
    if (!campaign)
      return Response.json(
        { error: "Campaign tidak ditemukan" },
        { status: 404 },
      );
    await prisma.campaign.delete({ where: { id } });
    return Response.json({ message: "Campaign dihapus" });
  } catch (error) {
    console.error("/api/campaigns/[id] DELETE error:", error);
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
