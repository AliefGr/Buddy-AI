import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const updateSchema = z.object({
  emailNotification: z.boolean().optional(),
  whatsappNotification: z.boolean().optional(),
  aiInsight: z.boolean().optional(),
  lowStock: z.boolean().optional(),
  dailyBrief: z.boolean().optional(),
  marketingReminder: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  monthlyReport: z.boolean().optional(),
  campaignReminder: z.boolean().optional(),
  broadcastReminder: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json();
    const parsed = updateSchema.parse(body);

    // Upsert notification settings
    const settings = await prisma.notificationSettings.upsert({
      where: { userId },
      update: parsed,
      create: { userId, ...parsed },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
