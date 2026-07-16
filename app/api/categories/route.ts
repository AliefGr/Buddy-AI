import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(50),
  color: z.string().optional(),
});

export async function GET() {
  try {
    const { storeId } = await requireAuth();
    const categories = await prisma.category.findMany({
      where: { storeId },
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return Response.json(categories);
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
      return Response.json(
        { error: "Validasi gagal", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const existing = await prisma.category.findUnique({
      where: { storeId_name: { storeId, name: parsed.data.name } },
    });
    if (existing) {
      return Response.json(
        { error: "Kategori dengan nama ini sudah ada" },
        { status: 409 }
      );
    }
    const category = await prisma.category.create({
      data: { storeId, name: parsed.data.name, color: parsed.data.color },
    });
    return Response.json(category, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
