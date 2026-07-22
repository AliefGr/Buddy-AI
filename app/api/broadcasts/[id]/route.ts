import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "SCHEDULED", "SENT"]).optional(),
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
  scheduledAt: z.string().optional(),
  campaignId: z.string().optional().nullable(),
  targetCustomer: z.string().optional().nullable(),
});

async function getAudienceFilter(
  targetCustomer: string | null | undefined,
  channel: string,
) {
  const now = new Date();
  let where: any = {};

  if (channel === "WHATSAPP") {
    where.phone = { not: null };
    where.optInWhatsApp = true;
  } else if (channel === "EMAIL") {
    where.email = { not: null };
    where.optInEmail = true;
  }

  switch (targetCustomer) {
    case "ALL":
      break;
    case "GOLD":
      where.tier = "GOLD";
      break;
    case "SILVER":
      where.tier = "SILVER";
      break;
    case "BRONZE":
      where.tier = "BRONZE";
      break;
    case "NEW":
      // Joined in last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      where.joinedAt = { gte: thirtyDaysAgo };
      break;
    case "INACTIVE":
      // No order in last 30 days
      const thirtyDaysAgoInactive = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000,
      );
      where.OR = [
        { lastOrderAt: { lt: thirtyDaysAgoInactive } },
        { lastOrderAt: null },
      ];
      break;
    case "TOP":
      // We'll get all customers and sort in app for MVP
      break;
    default:
      break;
  }
  return where;
}

async function sendWhatsAppMessage(
  phone: string,
  message: string,
  phoneNumberId: string,
  accessToken: string,
): Promise<boolean> {
  try {
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone.startsWith("+") ? phone : `+${phone.replace(/^0+/, "")}`,
        text: { body: message },
      }),
    });
    return response.ok;
  } catch (e) {
    console.error("WA send error:", e);
    return false;
  }
}

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
    const broadcast = await prisma.broadcast.findFirst({
      where: { id, storeId },
      include: { campaign: true },
    });
    if (!broadcast) {
      return Response.json(
        { error: "Broadcast tidak ditemukan" },
        { status: 404 },
      );
    }
    return Response.json(broadcast);
  } catch (error) {
    console.error("/api/broadcasts/[id] GET error:", error);
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
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }

    const broadcast = await prisma.broadcast.findFirst({
      where: { id, storeId },
    });
    if (!broadcast) {
      return Response.json(
        { error: "Broadcast tidak ditemukan" },
        { status: 404 },
      );
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (data.scheduledAt) {
      data.scheduledAt = new Date(data.scheduledAt as string);
    }

    if (parsed.data.status === "SENT") {
      data.sentAt = new Date();

      const audienceWhere = await getAudienceFilter(
        broadcast.targetCustomer,
        broadcast.channel,
      );

      const [store, customers] = await Promise.all([
        prisma.store.findUnique({ where: { id: storeId } }),
        prisma.customer.findMany({
          where: { storeId, ...audienceWhere },
        }),
      ]);

      let totalTarget = customers.length;
      let successCount = 0;
      let failedCount = 0;
      let deliveredCount = 0;

      if (
        broadcast.channel === "WHATSAPP" &&
        store?.waBusinessApiKey &&
        store.waBusinessPhoneId
      ) {
        for (const customer of customers) {
          if (!customer.phone) continue;
          const success = await sendWhatsAppMessage(
            customer.phone,
            broadcast.content.replace("{nama}", customer.name),
            store.waBusinessPhoneId,
            store.waBusinessApiKey,
          );
          if (success) {
            successCount++;
            deliveredCount++;
          } else {
            failedCount++;
          }
        }
      } else if (
        broadcast.channel === "EMAIL" ||
        broadcast.channel === "SMS" ||
        broadcast.channel === "INSTAGRAM"
      ) {
        // MVP: just count them as success
        successCount = totalTarget;
        deliveredCount = totalTarget;
      }

      data.totalTarget = totalTarget;
      data.successCount = successCount;
      data.failedCount = failedCount;
      data.deliveredCount = deliveredCount;
    }

    const updated = await prisma.broadcast.update({
      where: { id },
      data,
      include: { campaign: true },
    });
    return Response.json(updated);
  } catch (e) {
    console.error("/api/broadcasts/[id] PATCH error:", e);
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
    const broadcast = await prisma.broadcast.findFirst({
      where: { id, storeId },
    });
    if (!broadcast)
      return Response.json(
        { error: "Broadcast tidak ditemukan" },
        { status: 404 },
      );
    if (broadcast.status === "SENT") {
      return Response.json(
        { error: "Broadcast yang sudah terkirim tidak bisa dihapus" },
        { status: 409 },
      );
    }
    await prisma.broadcast.delete({ where: { id } });
    return Response.json({ message: "Broadcast dihapus" });
  } catch (error) {
    console.error("/api/broadcasts/[id] DELETE error:", error);
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
