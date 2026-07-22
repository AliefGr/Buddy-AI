import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  objective: z.string().optional(),
  description: z.string().optional(),
  targetCustomer: z.string().optional(),
  promotionType: z.string().optional(),
  promotionValue: z.number().int().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .enum(["DRAFT", "SCHEDULED", "ACTIVE", "FINISHED"])
    .optional()
    .default("DRAFT"),
  aiGenerated: z.boolean().optional().default(false),
});

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { broadcasts: true } },
        broadcasts: {
          select: {
            id: true,
            status: true,
            deliveredCount: true,
            successCount: true,
            totalTarget: true,
          },
        },
      },
    });
    return Response.json(campaigns);
  } catch (error) {
    console.error("/api/campaigns error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }
    const {
      name,
      objective,
      description,
      targetCustomer,
      promotionType,
      promotionValue,
      startDate,
      endDate,
      status,
      aiGenerated,
    } = parsed.data;
    const campaign = await prisma.campaign.create({
      data: {
        storeId,
        name,
        objective,
        description,
        targetCustomer,
        promotionType,
        promotionValue,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        aiGenerated,
      },
    });
    return Response.json(campaign, { status: 201 });
  } catch (error) {
    console.error("/api/campaigns POST error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
