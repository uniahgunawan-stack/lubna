'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTitle,DialogDescription } from '@/components/ui/dialog';
import usePreviewModal from '@/hooks/use-preview-modal';
import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import Link from 'next/link';

const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const product = previewModal.data;
  if (!product) {
    return null;
  }

  return (
    <Dialog open={previewModal.isOpen} onOpenChange={previewModal.onClose}>
      <DialogContent className="max-w-full p-8">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">{product.description}</DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-auto rounded-lg overflow-hidden">
            <Image
              src={product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 mt-4 line-clamp-3 whitespace-pre-wrap">{product.description}</p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-green-500 mr-2">
                Rp {product.discountPrice?.toLocaleString('id-ID') || product.price.toLocaleString('id-ID')}
              </span>
              {product.discountPrice && (
                <span className="text-lg line-through text-red-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                  )}
                />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.rating.toFixed(1)})
              </span>
            </div>
            <Link href={`/detail-product/${product.id}`} scroll={true}>
              <Button onClick={previewModal.onClose} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Lihat Detail
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
