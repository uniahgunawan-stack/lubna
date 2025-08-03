import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Context) {
  const { id: productId } = await params; // Await and destructure id
  try {
    const formData = await req.formData();
    const comment = formData.get('comment') as string;
    const ratingString = formData.get('rating') as string;
    const images = formData.getAll('images') as File[];

    // Validasi yang lebih robust untuk rating
    const rating = ratingString ? parseInt(ratingString) : NaN;
    if (!comment || isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Teks ulasan dan rating diperlukan, dan rating harus antara 1-5.' },
        { status: 400 }
      );
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'reviewsimages',
          resource_type: 'image',
          timeout: 60000,
          transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'auto' }],
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        productId,
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })),
        },
      },
      include: { images: true },
    });

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await prisma.product.update({
      where: { id: productId },
      data: { rating: parseFloat(avgRating.toFixed(1)) },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat membuat ulasan.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { id: productId } = await params; // Await and destructure id
  try {
    const formData = await req.formData();
    const reviewId = formData.get('reviewId') as string;
    const comment = formData.get('comment') as string;
    const ratingString = formData.get('rating') as string;

    // Parse existingImages safely
    const existingImagesString = formData.get('existingImages') as string;
    let existingImages: { id: string; url: string; publicId: string }[] = [];
    if (existingImagesString) {
      try {
        existingImages = JSON.parse(existingImagesString);
      } catch (parseError) {
        console.error('Failed to parse existingImages:', parseError);
        return NextResponse.json(
          { error: 'Format existingImages tidak valid.' },
          { status: 400 }
        );
      }
    }

    const images: File[] = [];
    formData.getAll('images').forEach((item) => {
      if (item instanceof File) {
        images.push(item);
      }
    });

    const rating = ratingString ? parseInt(ratingString) : NaN;
    if (!comment || isNaN(rating) || rating < 1 || rating > 5 || !reviewId) {
      return NextResponse.json(
        { error: 'Teks ulasan, rating (1-5), dan ID ulasan diperlukan.' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { images: true },
    });

    if (!review) {
      return NextResponse.json({ error: 'Ulasan tidak ditemukan.' }, { status: 404 });
    }

    // Delete images not included in existingImages
    const imagesToDelete = review.images.filter(
      (dbImg) => !existingImages.some((clientImg) => clientImg.id === dbImg.id)
    );

    for (const img of imagesToDelete) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      await prisma.reviewImage.delete({ where: { id: img.id } });
    }

    // Upload new images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'reviewsimages',
          resource_type: 'image',
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    // Add new images to Prisma
    if (uploadedImages.length > 0) {
      await prisma.reviewImage.createMany({
        data: uploadedImages.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          reviewId,
        })),
      });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        comment,
        rating,
      },
      include: { images: true },
    });

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId: updatedReview.productId },
      select: { rating: true },
    });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await prisma.product.update({
      where: { id: updatedReview.productId },
      data: { rating: parseFloat(avgRating.toFixed(1)) },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat memperbarui ulasan.' }, { status: 500 });
  }
}