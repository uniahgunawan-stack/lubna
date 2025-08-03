// app/api/banners/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary"; // Pastikan Anda punya konfigurasi cloudinary

// GET all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      include: {
        bannerImages: {
          orderBy: {}, // Opsional: urutkan gambar
        },
      },
      orderBy: { createdAt: "desc" }, // Opsional: urutkan banner terbaru di atas
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data banner.", error: error.message },
      { status: 500 }
    );
  }
}

// POST a new banner
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (!description || !imageFile) {
      return NextResponse.json(
        { message: "Deskripsi dan gambar harus diisi." },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "bannerimage", resource_type: "image", timeout: 60000 },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(
                new Error("Gagal mengunggah gambar ke Cloudinary.")
              );
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    const imageUrl = (uploadResult as any).secure_url;
    const publicId = (uploadResult as any).public_id;

    // Create banner in Prisma
    const newBanner = await prisma.banner.create({
      data: {
        description,
        bannerImages: {
          create: {
            url: imageUrl,
            publicId: publicId,
          },
        },
      },
      include: { bannerImages: true },
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { message: "Gagal membuat banner baru.", error: error.message },
      { status: 500 }
    );
  }
}
