import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { store: true, notificationSettings: true },
  });

  return NextResponse.json({
    id: user?.id,
    name: user?.name || session.user.name,
    email: user?.email || session.user.email,
    avatarUrl: user?.avatarUrl || null,
    phone: user?.phone || null,
    address: user?.address || null,
    bio: user?.bio || null,
    role: user?.role,
    storeName: user?.store?.name || null,
    notificationSettings: user?.notificationSettings || null,
  });
}
