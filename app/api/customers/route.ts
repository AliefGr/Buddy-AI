import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  optInWhatsApp: z.boolean().optional().default(true),
  optInEmail: z.boolean().optional().default(true),
  tier: z
    .enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"])
    .optional()
    .default("BRONZE"),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";

  try {
    const customers = await prisma.customer.findMany({
      where: {
        storeId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { totalSpent: "desc" },
      include: { _count: { select: { orders: true } } },
    });

    return Response.json(customers);
  } catch (error) {
    console.error("/api/customers error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, phone, optInWhatsApp, optInEmail, tier } = parsed.data;

    if (email) {
      const existing = await prisma.customer.findUnique({
        where: { storeId_email: { storeId, email } },
      });
      if (existing) {
        return Response.json(
          { error: "Email sudah terdaftar" },
          { status: 409 },
        );
      }
    }

    const customer = await prisma.customer.create({
      data: {
        storeId,
        name,
        email: email || null,
        phone: phone || null,
        optInWhatsApp,
        optInEmail,
        tier,
      },
    });

    return Response.json(customer, { status: 201 });
  } catch {
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
