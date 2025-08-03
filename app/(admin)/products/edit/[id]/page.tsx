import { PrismaClient } from '@prisma/client';
import EditProductPage from './EditProductPage/page';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import { NextPage } from 'next';


interface EditProductPageProps {
  params: Promise<{ id: string }>; 
}

const prisma = new PrismaClient();

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

// Use NextPage with async params
const EditProduct: NextPage<EditProductPageProps> = async ({ params }) => {
  // Await the params to resolve the Promise
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <EditProductPage product={product} />;
};

export default EditProduct;