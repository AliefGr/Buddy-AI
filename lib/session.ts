import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const storeId = (session.user as { storeId?: string | null }).storeId;
  if (!storeId) {
    redirect("/login");
  }
  return {
    userId: session.user.id as string,
    storeId,
    name: session.user.name as string,
    email: session.user.email as string,
  };
}
