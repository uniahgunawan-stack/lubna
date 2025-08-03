import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary'; 

export async function DELETE(req: NextRequest, { params }: { params: { reviewId: string } }) {
        
        const awaitedParams = await params;
        
        const reviewId = awaitedParams.reviewId;

  if (!reviewId) {
    return NextResponse.json({ error: 'ID ulasan diperlukan.' }, { status: 400 });
  }

  try {
   
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { images: true },
    });

    if (!review) {
      return NextResponse.json({ error: 'Ulasan tidak ditemukan.' }, { status: 404 });
    }

    
    const deleteImagePromises = review.images.map(async (image) => {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
          console.log(`Cloudinary: Image ${image.publicId} deleted.`);
        } catch (cloudinaryError) {
          console.error(`Cloudinary: Failed to delete image ${image.publicId}:`, cloudinaryError);
         
        }
      }
    });
    await Promise.all(deleteImagePromises);

   
    await prisma.review.delete({
      where: { id: reviewId },
    });
    console.log(`Prisma: Review ${reviewId} deleted.`);

    
    const reviews = await prisma.review.findMany({
      where: { productId: review.productId },
      select: { rating: true },
    });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: parseFloat(avgRating.toFixed(1)) },
    });
    console.log(`Prisma: Product ${review.productId} rating updated to ${avgRating.toFixed(1)}.`);

    return NextResponse.json({ message: 'Ulasan dan gambar terkait berhasil dihapus.' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat menghapus ulasan.' }, { status: 500 });
  }
}