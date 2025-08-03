
export interface ProductImage {
  id: string;
  url: string;
  order: number;
  publicId?: string;
  productId: string;
}

export interface FormValues {
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: File[];
}

export interface ReviewImage {
  id: string;
  url: string;
  publicId?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  images: ReviewImage[];
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: ProductImage[];
  reviews: Review[];
  rating: number;
  isPublished: boolean;
  createdAt: Date;
} 

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: File []
};
 
export interface Banner{
  id: string;
  description: string;
  bannerImages: BannerImage[]
}

export interface BannerImage{
  id: string;
  url: string;
  publicid?: string;
}


export interface ProductDetailData {
  id: string;
  images: ProductImage[]; // Sesuaikan dengan 'images' dari Prisma
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  description: string;
  reviews: Review[];
  isPublished: boolean;
  createdAt: string;
  favoritedBy: { id: string }[];
}