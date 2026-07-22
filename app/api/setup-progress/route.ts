import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export interface SetupStep {
  id: string;
  label: string;
  icon: string;
  done: boolean;
}

export interface SetupProgressData {
  steps: SetupStep[];
  completed: number;
  total: number;
  percentage: number;
}

export async function GET() {
  try {
    const { storeId } = await requireAuth();

    const [store, categoryCount, productCount, customerCount] =
      await Promise.all([
        prisma.store.findUnique({ where: { id: storeId } }),
        prisma.category.count({ where: { storeId } }),
        prisma.product.count({ where: { storeId } }),
        prisma.customer.count({ where: { storeId } }),
      ]);

    if (!store) {
      return Response.json({ error: "Store tidak ditemukan" }, { status: 404 });
    }

    const steps: SetupStep[] = [
      {
        id: "profile",
        label: "Profil Bisnis",
        icon: "🏪",
        done: Boolean(store.name && store.address && store.phone),
      },
      {
        id: "categories",
        label: "Tambah Kategori Produk",
        icon: "📂",
        done: categoryCount > 0,
      },
      {
        id: "products",
        label: "Tambah Produk",
        icon: "📦",
        done: productCount > 0,
      },
      {
        id: "customers",
        label: "Tambah Pelanggan",
        icon: "👥",
        done: customerCount > 0,
      },
      {
        id: "whatsapp",
        label: "Hubungkan WhatsApp",
        icon: "💬",
        done: Boolean(store.waBusinessPhoneId && store.waBusinessApiKey),
      },
      {
        id: "email",
        label: "Hubungkan Email",
        icon: "✉️",
        done: Boolean(
          store.emailSmtpHost &&
          store.emailSmtpPort &&
          store.emailSmtpUser &&
          store.emailSmtpPassword,
        ),
      },
    ];

    const completed = steps.filter((s) => s.done).length;
    const total = steps.length;
    const percentage = Math.round((completed / total) * 100);

    const data: SetupProgressData = { steps, completed, total, percentage };
    return Response.json(data);
  } catch (err) {
    // Re-throw Next.js redirect signals so they are handled correctly
    if (isRedirectError(err)) throw err;
    return Response.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
