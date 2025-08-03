'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define custom types for transformed output
export type ProductImage = Prisma.ProductImageGetPayload<{}>;
export type ReviewImage = Prisma.ReviewImageGetPayload<{}>;
export type Review = Prisma.ReviewGetPayload<{
  include: { images: true };
}>;

// PERBAIKAN: Ubah 'select' di 'reviews' menjadi 'include'
export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    images: true;
    reviews: {
      include: {
        images: true;
      };
    };
    favoritedBy: {
      select: { id: true };
    };
  };
}>;

// Custom type for transformed Banner output
export type BannerImageTransformed = {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BannerWithImagesTransformed = {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  bannerImages: BannerImageTransformed[];
};

export type ProductTransformed = Omit<ProductWithDetails, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export async function getBanners(): Promise<BannerWithImagesTransformed[]> {
  try {
    const banners = await prisma.banner.findMany({
      include: {
        bannerImages: {
          select: { id: true, url: true, publicId: true, altText: true, createdAt: true, updatedAt: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return banners.map((banner) => ({
      ...banner,
      createdAt: banner.createdAt.toISOString(),
      updatedAt: banner.updatedAt.toISOString(),
      bannerImages: banner.bannerImages.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        altText: img.altText,
        createdAt: img.createdAt.toISOString(),
        updatedAt: img.updatedAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw new Error('Gagal mengambil data banner.');
  }
}

export async function getProducts(options?: {
  limit?: number;
  orderBy?: 'createdAt' | 'price' | 'name' | 'rating';
  orderDirection?: 'asc' | 'desc';
  search?: string;
}): Promise<ProductTransformed[]> { 
  const { limit, orderBy, orderDirection, search } = options || {};

  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      // PERBAIKAN: Mengubah select menjadi include agar sesuai dengan tipe
      include: {
        images: true,
        favoritedBy: {
          select: { id: true },
        },
        reviews: {
          include: { images: true },
        },
      },
      orderBy: {
        [orderBy || 'createdAt']: orderDirection || 'desc',
      },
      take: limit,
    });

    return products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(), // Assuming `updatedAt` also exists
      images: product.images.map((img) => ({
        ...img,
      })),
      reviews: product.reviews.map((review) => ({
        ...review,
      })),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Gagal mengambil data produk.');
  }
}

export async function getProductById(id: string): Promise<ProductTransformed | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        favoritedBy: {
          select: { id: true },
        },
        reviews: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(), // Assuming `updatedAt` also exists
      images: product.images.map((img) => ({
        ...img,
      })),
      reviews: product.reviews.map((review) => ({
        ...review,
        images: review.images.map((revImg) => ({
          ...revImg,
        })),
      })),
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw new Error('Gagal mengambil detail produk.');
  }
}

export async function getFavoriteProducts(userId: string): Promise<ProductTransformed[]> {
  try {
    const userWithFavorites = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          include: {
            images: true,
            reviews: {
              include: {
                images: true,
              },
            },
            favoritedBy: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!userWithFavorites) {
      return [];
    }
    return userWithFavorites.favorites.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(), // Assuming `updatedAt` also exists
      images: product.images.map((img) => ({
        ...img,
      })),
      reviews: product.reviews.map((review) => ({
        ...review,
        images: review.images.map((revImg) => ({
          ...revImg,
        })),
      })),
    }));
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    throw new Error('Gagal mengambil produk favorit.');
  }
}