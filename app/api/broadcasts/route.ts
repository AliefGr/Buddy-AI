import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  channel: z.enum(["WHATSAPP", "EMAIL", "SMS", "INSTAGRAM"]),
  content: z.string().min(1),
  scheduledAt: z.string().optional(),
  campaignId: z.string().optional(),
  targetCustomer: z.string().optional(),
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
    const broadcasts = await prisma.broadcast.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: { campaign: true },
    });
    return Response.json(broadcasts);
  } catch (error) {
    console.error("/api/broadcasts GET error:", error);
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
    const { title, channel, content, scheduledAt, campaignId, targetCustomer } =
      parsed.data;
    const broadcast = await prisma.broadcast.create({
      data: {
        storeId,
        title,
        channel,
        content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? "SCHEDULED" : "DRAFT",
        campaignId,
        targetCustomer,
      },
    });
    return Response.json(broadcast, { status: 201 });
  } catch (error) {
    console.error("/api/broadcasts POST error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
