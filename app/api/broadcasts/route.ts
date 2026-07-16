import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  channel: z.enum(["WHATSAPP", "EMAIL", "SMS"]),
  content: z.string().min(1),
  scheduledAt: z.string().optional(),
});

export async function GET() {
  try {
    const { storeId } = await requireAuth();
    const broadcasts = await prisma.broadcast.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(broadcasts);
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
    const { title, channel, content, scheduledAt } = parsed.data;
    const broadcast = await prisma.broadcast.create({
      data: {
        storeId, title, channel, content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? "SCHEDULED" : "DRAFT",
      },
    });
    return Response.json(broadcast, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
