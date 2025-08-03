// app/api/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const formData = await req.formData();
    const description = formData.get('description') as string;
    const newImageFile = formData.get('image') as File | null; // Bisa null jika tidak ada perubahan gambar
    const oldPublicId = formData.get('oldPublicId') as string | null; // Untuk menghapus gambar lama

    if (!description) {
      return NextResponse.json({ message: 'Deskripsi banner harus diisi.' }, { status: 400 });
    }

    let imageUrl: string | undefined;
    let publicId: string | undefined;

    if (newImageFile) {
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`Cloudinary: Old banner image ${oldPublicId} deleted.`);
        } catch (cloudinaryErr) {
          console.error(`Cloudinary: Failed to delete old banner image ${oldPublicId}:`, cloudinaryErr);
        }
      }

      // Upload gambar baru
      const arrayBuffer = await newImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
               { folder: 'bannerimage',resource_type: 'image',
                  timeout:60000,
                },
          (error, result) => {
            if (error || !result) {
              console.error('Cloudinary upload error:', error);
              return reject(new Error('Gagal mengunggah gambar baru ke Cloudinary.'));
            } resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        ).end(buffer);
      });

        imageUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
    }

    // Update banner di Prisma
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        description,
        // Jika ada gambar baru, perbarui bannerImages
        ...(imageUrl && publicId && {
          bannerImages: {
            deleteMany: {
              bannerId: id // Hapus semua gambar lama yang terkait dengan banner ini di DB
            },
            create: {
              url: imageUrl,
              publicId: publicId,
              
            },
          },
        }),
      },
      include: { bannerImages: true },
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error);
    return NextResponse.json({ message: 'Gagal memperbarui banner.', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const banner = await prisma.banner.findUnique({
      where: { id },
      include: { bannerImages: true },
    });

    if (!banner) {
      return NextResponse.json({ message: 'Banner tidak ditemukan.' }, { status: 404 });
    }

    // Hapus gambar dari Cloudinary
    for (const image of banner.bannerImages) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
          console.log(`Cloudinary: Banner image ${image.publicId} deleted.`);
        } catch (cloudinaryErr) {
          console.error(`Cloudinary: Failed to delete banner image ${image.publicId}:`, cloudinaryErr);
        }
      }
    }

    // Hapus banner dari Prisma (onDelete: Cascade di prisma schema akan menangani bannerImages)
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Banner berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting banner:', error);
   const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error);
    return NextResponse.json({ message: 'Gagal hapus banner.', error: errorMessage }, { status: 500 });
  }
}