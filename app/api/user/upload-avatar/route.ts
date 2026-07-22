import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

// Ensure the uploads directory exists
const uploadDir = join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create upload directory if not exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log("Upload directory already exists");
    }

    // Generate a unique filename
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, uniqueFileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Save the file to disk
    await writeFile(filePath, fileBuffer);

    // Update user's avatar URL in the database
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: `/uploads/${uniqueFileName}` },
    });

    return NextResponse.json({ avatarUrl: `/uploads/${uniqueFileName}` }, { status: 200 });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
