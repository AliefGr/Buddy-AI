import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { generateText, isAIConfigured } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  productId: z.string().optional(),
  type: z
    .enum(["caption", "hashtag", "promo", "description"])
    .default("caption"),
  platform: z.enum(["instagram", "whatsapp", "tiktok"]).default("instagram"),
  productName: z.string().optional(),
  audience: z.string().optional(),
  tone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await requireAuth();

    if (!isAIConfigured()) {
      return Response.json(
        { error: "AI tidak dikonfigurasi" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Input tidak valid" }, { status: 400 });
    }

    const { productId, type, platform, productName, audience, tone } =
      parsed.data;

    let productContext = "";
    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: productId, storeId },
        include: { category: true },
      });
      if (product) {
        productContext = `\nProduk: ${product.name}\nKategori: ${product.category.name}\nHarga: Rp ${product.price.toLocaleString("id-ID")}\nDeskripsi: ${product.description ?? "-"}`;
      }
    }

    const platformGuide = {
      instagram:
        "Instagram — kasual, visual, gunakan emoji, maks 2200 karakter",
      whatsapp: "WhatsApp broadcast — personal, singkat, ada CTA jelas",
      tiktok: "TikTok caption — singkat, trendy, hashtag challenge",
    };

    const typeGuide = {
      caption: "Buat caption promosi yang menarik dan engaging",
      hashtag: "Generate 15-20 hashtag relevan untuk meningkatkan reach",
      promo: "Buat teks promo spesial dengan penawaran yang menarik",
      description: "Buat deskripsi produk yang menarik dan informatif",
    };

    if (!productContext && productName) {
      productContext = `\nProduk: ${productName}`;
    }
    const audienceCtx = audience ? `\nTarget audiens: ${audience}` : "";
    const toneCtx = tone
      ? `\nTone/gaya penulisan: ${tone} — sesuaikan nada dan pilihan kata`
      : "";

    const prompt = `Kamu adalah copywriter marketing UMKM Indonesia yang kreatif.
${typeGuide[type]} untuk platform ${platformGuide[platform]}.
${productContext}${audienceCtx}${toneCtx}

Gunakan Bahasa Indonesia yang natural, relatable, dan sesuai target UMKM.
Langsung berikan hasilnya tanpa penjelasan tambahan.`;

    const content = await generateText(prompt);

    return Response.json({ content, type, platform });
  } catch (error) {
    console.error("[AI Marketing]", error);
    return Response.json(
      { error: "Gagal generate konten marketing" },
      { status: 500 },
    );
  }
}
