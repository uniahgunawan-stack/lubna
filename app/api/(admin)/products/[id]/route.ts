import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

// PERBAIKAN: Definisikan tipe untuk params secara terpisah
interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) { // <-- Ubah di sini
  const { id } = params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          select: { id: true, url: true, publicId: true, order: true },
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) { // <-- Ubah di sini
  const { id } = params;
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string);
    const discountPrice = formData.get('discountPrice') ? parseInt(formData.get('discountPrice') as string) : null;
    const existingImages = formData.getAll('existingImages[]').map((img) => JSON.parse(img as string)) as {
      id: string;
      url: string;
      publicId: string;
      order: number;
    }[];
    const newImages = formData.getAll('images') as File[];
    const imageOrders = formData.getAll('imageOrders[]').map(Number);

    // Validasi input
    if (!name || !description) {
      return NextResponse.json({ error: 'Nama dan deskripsi diperlukan.' }, { status: 400 });
    }
    if (isNaN(price) || price < 1 || !Number.isInteger(price)) {
      return NextResponse.json({ error: 'Harga harus bilangan bulat positif.' }, { status: 400 });
    }
    if (discountPrice !== null && (isNaN(discountPrice) || discountPrice < 0 || !Number.isInteger(discountPrice))) {
      return NextResponse.json({ error: 'Harga diskon harus bilangan bulat non-negatif atau kosong.' }, { status: 400 });
    }

    // Cari produk
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    // Hanya hapus gambar jika existingImages[] tidak kosong
    let imagesToDelete = [];
    if (existingImages.length > 0) {
      imagesToDelete = product.images.filter(
        (img) => !existingImages.some((ei) => ei.id === img.id)
      );
      for (const img of imagesToDelete) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
        await prisma.productImage.delete({ where: { id: img.id } });
      }
    }

    // Upload gambar baru ke Cloudinary
    const uploadedImages = await Promise.all(
      newImages.map(async (file: File, index: number) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'productImage',
          resource_type: 'image',
          timeout: 60000,
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'auto' }
          ]
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
          order: imageOrders[index] ?? existingImages.length + index,
        };
      })
    );

    // Update produk dan gambar
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        discountPrice,
        images: {
          // Update order untuk gambar yang sudah ada hanya jika existingImages[] tidak kosong
          ...(existingImages.length > 0 && {
            update: existingImages.map((img) => ({
              where: { id: img.id },
              data: { order: img.order },
            })),
          }),
          // Tambah gambar baru
          create: uploadedImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        },
      },
      include: {
        images: {
          select: { id: true, url: true, publicId: true, order: true },
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: { images: true },
        },
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) { // <-- Ubah di sini
  const { id } = params;
  try {
    // 1. Ambil produk beserta gambar produk dan juga SEMUA GAMBAR ULASAN terkait
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true, // Untuk gambar produk
        reviews: {
          include: { images: true }, // <--- PENTING: Sertakan gambar ulasan di sini
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    
    // 2. Hapus semua gambar produk dan ulasan terkait dari Cloudinary
    const productImageDeletePromises = product.images.map(async (img) => {
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
          console.log(`Cloudinary: Product image ${img.publicId} deleted.`);
        } catch (cloudinaryErr) {
          console.error(`Cloudinary: Failed to delete product image ${img.publicId}:`, cloudinaryErr);
        }
      }
    });

    const reviewImageDeletePromises: Promise<void>[] = [];
    for (const review of product.reviews) {
      for (const img of review.images) {
        if (img.publicId) {
          reviewImageDeletePromises.push((async () => {
            try {
              await cloudinary.uploader.destroy(img.publicId);
              console.log(`Cloudinary: Review image ${img.publicId} deleted.`);
            } catch (cloudinaryErr) {
              console.error(`Cloudinary: Failed to delete review image ${img.publicId}:`, cloudinaryErr);
            }
          })());
        }
      }
    }
    await Promise.all([...productImageDeletePromises, ...reviewImageDeletePromises]);
    
    // 3. Hapus produk dan data terkait di Prisma
    await prisma.product.delete({
      where: { id },
    });
    console.log(`Prisma: Product ${id} and related data deleted from DB.`);

    return NextResponse.json({ message: 'Produk dan gambar terkait berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server saat menghapus produk.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}