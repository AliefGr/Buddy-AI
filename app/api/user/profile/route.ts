import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

export async function GET() {
  try {
    const { userId } = await requireAuth();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        phone: true,
        address: true,
        bio: true,
        store: { select: { id: true, name: true } },
      },
    });
    if (!user) return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    return Response.json(user);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const body = await request.json();
    const parsed = z.object({
      name: z.string().min(1).max(100),
      phone: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      bio: z.string().optional().nullable(),
    }).safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal" }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        bio: parsed.data.bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        bio: true,
      },
    });
    return Response.json(user);
  } catch {
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
