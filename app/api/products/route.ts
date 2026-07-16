import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  sku: z.string().min(1, "SKU wajib diisi").max(50),
  name: z.string().min(1, "Nama produk wajib diisi").max(100),
  description: z.string().optional(),
  price: z.number().int().min(0, "Harga tidak boleh negatif"),
  costPrice: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? "";
    const categoryId = searchParams.get("categoryId") ?? "";
    const status = searchParams.get("status") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;

    const where = {
      storeId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { sku: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(status === "active" && { isActive: true }),
      ...(status === "inactive" && { isActive: false }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, color: true } },
          inventory: { select: { currentStock: true, status: true } },
          _count: { select: { orderItems: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return Response.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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

    const { categoryId, sku, name, description, price, costPrice, imageUrl, isActive } = parsed.data;

    const category = await prisma.category.findFirst({ where: { id: categoryId, storeId } });
    if (!category) {
      return Response.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }

    const existingSku = await prisma.product.findUnique({
      where: { storeId_sku: { storeId, sku } },
    });
    if (existingSku) {
      return Response.json({ error: "SKU sudah digunakan" }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        storeId,
        categoryId,
        sku,
        name,
        description,
        price,
        costPrice,
        imageUrl: imageUrl || null,
        isActive,
        inventory: {
          create: {
            sku,
            currentStock: 0,
            minStock: 5,
            unit: "pcs",
          },
        },
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        inventory: { select: { currentStock: true, status: true } },
      },
    });

    return Response.json(product, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
