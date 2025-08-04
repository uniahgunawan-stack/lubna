'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Expand, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {cn} from '@/lib/utils'
import usePreviewModal from '@/hooks/use-preview-modal';
import useFavorite from '@/hooks/use-favorits';
import { ProductTransformed } from '@/actions/data';
import LoginToFavoriteModal from '@/components/modals/modal-favorits';

interface ProductCardProps {
  product: ProductTransformed;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const previewModal = usePreviewModal();
  const { isFavorited, isLoading, toggleFavoriteStatus, userLoggedIn } = useFavorite({ product });

  // State baru untuk mengontrol modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const onPreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    previewModal.onOpen(product);
  };
  
  // Fungsi baru yang menangani klik tombol Favorit
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (userLoggedIn) {
      toggleFavoriteStatus();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const mainImageUrl = product.images?.[0]?.url || '/placeholder-product.jpg';

  return (
    <div className="border rounded-lg overflow-hidden shadow-md dark:bg-gray-800 dark:border-gray-700 group">
      <Link href={`/detail-product/${product.id}`} className="block" scroll={true}>
        <div className="relative w-full h-40 md:h-50 xl:h-64 bg-gray-200 dark:bg-gray-700">
          <Image
            src={mainImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm h-10 w-10 text-gray-800 hover:bg-white"
              onClick={onPreview}
            >
              <Expand className="h-6 w-6" />
              <span className="sr-only">Quick Preview</span>
            </Button>
          </div>        
        </div>
      </Link>
      <div className="p-2">
        <Link href={`/detail-product/${product.id}`} scroll={true}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-green-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
          <span className="text-xs text-gray-600 dark:text-gray-400">
            ({product.rating.toFixed(1)})
          </span>
        </div>
        <div className="mt-2">
          <p className="text-red-600 dark:text-red-400 text-sm md:text-xl line-through">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          {product.discountPrice && product.discountPrice < product.price && (
            <p className="text-green-500 dark:text-green-400 text-lg md:text-2xl font-bold mb-0 ">
              Rp {product.discountPrice.toLocaleString('id-ID')}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={isFavorited ? "text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900" : ""}
          >
            <Heart className={`h-2 w-2 mr-1 ${isFavorited ? 'fill-red-500' : ''}`} /> Favorit
          </Button>
        </div>
      </div>
      <LoginToFavoriteModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default ProductCard;
