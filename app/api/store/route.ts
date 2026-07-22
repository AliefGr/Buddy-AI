import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

export async function GET() {
  try {
    const { storeId } = await requireAuth();
    const store = await prisma.store.findUnique({
      where: { id: storeId },
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
    const parsed = z
      .object({
        name: z.string().min(1).max(100).optional(),
        currency: z.string().optional(),
        timezone: z.string().optional(),
        logoUrl: z.string().optional().nullable(),
        businessCategory: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        province: z.string().optional().nullable(),
        postalCode: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        whatsapp: z.string().optional().nullable(),
        instagram: z.string().optional().nullable(),
        facebook: z.string().optional().nullable(),
        tiktok: z.string().optional().nullable(),
        website: z.string().optional().nullable(),
        operatingHours: z.string().optional().nullable(),
        googleMapsLink: z.string().optional().nullable(),
        npwp: z.string().optional().nullable(),
        waBusinessPhoneId: z.string().optional().nullable(),
        waBusinessAccountId: z.string().optional().nullable(),
        waBusinessApiKey: z.string().optional().nullable(),
        waBusinessVerifyToken: z.string().optional().nullable(),
        waBusinessWebhookUrl: z.string().optional().nullable(),
        emailSmtpHost: z.string().optional().nullable(),
        emailSmtpPort: z.coerce.number().int().optional().nullable(),
        emailSmtpUser: z.string().optional().nullable(),
        emailSmtpPassword: z.string().optional().nullable(),
        emailEncryption: z.string().optional().nullable(),
        emailSenderName: z.string().optional().nullable(),
        emailSenderEmail: z.string().optional().nullable(),
        instagramAccessToken: z.string().optional().nullable(),
        instagramBusinessAccount: z.string().optional().nullable(),
        facebookPageId: z.string().optional().nullable(),
        facebookAccessToken: z.string().optional().nullable(),
      })
      .safeParse(body);
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
