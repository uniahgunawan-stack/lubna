import { PrismaClient } from '@prisma/client';
import EditProductPage from './EditProductPage/page';
import { Product } from '@/types';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

// Interface ini sudah benar, jadi kita biarkan saja
interface EditProductPageProps {
  params: { id: string };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        order: img.order,
        publicId: img.publicId,
        productId: img.productId,
      })),
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images.map((img) => ({
          id: img.id,
          url: img.url,
          publicId: img.publicId,
        })),
        productId: review.productId,
      })),
      rating: product.rating,
      isPublished: product.isPublished,
      createdAt: product.createdAt,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function EditProduct({ params }: EditProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <EditProductPage product={product} />;
}
