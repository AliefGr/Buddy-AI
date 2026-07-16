import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  platform: z.string().min(1),
  budget: z.number().int().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  emoji: z.string().optional(),
});

export async function GET() {
  try {
    const { storeId } = await requireAuth();
    const campaigns = await prisma.campaign.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(campaigns);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }
    const { name, platform, budget, startDate, endDate, emoji } = parsed.data;
    const campaign = await prisma.campaign.create({
      data: {
        storeId, name, platform, budget,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        emoji: emoji ?? "📢",
      },
    });
    return Response.json(campaign, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
