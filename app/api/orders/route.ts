import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customerId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "QRIS", "TRANSFER"]).default("CASH"),
  discount: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Order harus memiliki minimal 1 item"),
});

async function generateOrderNumber(storeId: string): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const count = await prisma.order.count({ where: { storeId } });
  return `INV-${year}${month}-${String(count + 1).padStart(4, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const status = request.nextUrl.searchParams.get("status") ?? "";
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1"));
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = { storeId, ...(status && { status: status as never }) };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, name: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal", details: parsed.error.flatten() }, { status: 400 });
    }

    const { customerId, paymentMethod, discount, notes, items } = parsed.data;

    const products = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) }, storeId, isActive: true },
      include: { inventory: true },
    });

    if (products.length !== items.length) {
      return Response.json({ error: "Satu atau lebih produk tidak valid" }, { status: 400 });
    }

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)!;
      const stock = product.inventory?.currentStock ?? 0;
      if (stock < item.quantity) {
        return Response.json({
          error: `Stok ${product.name} tidak cukup. Tersisa: ${stock}, dibutuhkan: ${item.quantity}`,
        }, { status: 400 });
      }
    }

    const subtotal = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);
    const total = Math.max(0, subtotal - discount);
    const orderNumber = await generateOrderNumber(storeId);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          storeId,
          customerId: customerId || null,
          orderNumber,
          paymentMethod,
          subtotal,
          discount,
          total,
          status: "COMPLETED",
          notes,
          items: {
            create: items.map(item => {
              const product = products.find(p => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal: product.price * item.quantity,
              };
            }),
          },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
          customer: { select: { name: true } },
        },
      });

      for (const item of items) {
        const product = products.find(p => p.id === item.productId)!;
        if (!product.inventory) continue;
        const newStock = product.inventory.currentStock - item.quantity;
        const newStatus = newStock === 0 ? "EMPTY" : newStock < product.inventory.minStock ? "LOW" : "NORMAL";

        await tx.inventoryItem.update({
          where: { id: product.inventory.id },
          data: { currentStock: newStock, status: newStatus },
        });

        await tx.stockMovement.create({
          data: {
            inventoryItemId: product.inventory.id,
            type: "OUT",
            quantity: item.quantity,
            note: `Terjual via order ${orderNumber}`,
          },
        });
      }

      if (customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalSpent: { increment: total },
            lastOrderAt: new Date(),
          },
        });
      }

      return newOrder;
    });

    return Response.json(order, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
