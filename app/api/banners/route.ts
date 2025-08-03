import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      include: {
        bannerImages: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
   
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Gagal mengambil data banner.", error: errorMessage },
      { status: 500 }
    );
  }
}

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

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "bannerimage", resource_type: "image", timeout: 60000 },
          (error, result) => {
            if (error || !result) {
              console.error("Cloudinary upload error:", error);
              return reject(
                new Error("Gagal mengunggah gambar ke Cloudinary.")
              );
            }
            resolve(result as CloudinaryUploadResult);
          }
        )
        .end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

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
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Gagal membuat banner baru.", error: errorMessage },
      { status: 500 }
    );
  }
}
