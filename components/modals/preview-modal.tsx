'use client';

import React from 'react';
import Image from 'next/image';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import usePreviewModal from '@/hooks/use-preview-modal';
import WhatsAppButton from '@/components/WhatsAppButton';
import useFavorite from '@/hooks/use-favorits';
import { ProductTransformed } from '@/actions/data';

const PreviewModal: React.FC = () => {
  const previewModal = usePreviewModal();
  const product: ProductTransformed | undefined = previewModal.data as ProductTransformed | undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const { isFavorited, isLoading, toggleFavoriteStatus } = useFavorite(
    product ? { product } : { product: {} as ProductTransformed }
  );

  if (!product) {
    return null;  }

  const mainImageUrl = product.images?.[0]?.url || '/placeholder-product.jpg';
  const formatPrice = (product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price
  ).toLocaleString('id-ID');
  const productUrl = `${siteUrl}/product/${product.id}`;
  const productNameForWhatsapp = product.name;
  const whatsappMessage = `Halo, saya tertarik dengan produk *${productNameForWhatsapp}* ❤️ (${product.name}) yang Anda jual seharga Rp${formatPrice}. Apakah produk ini masih tersedia? Cek produk: ${productUrl}`;

  return (
    <Dialog open={previewModal.isOpen} onOpenChange={previewModal.onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={previewModal.onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Tutup</span>
          </Button>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Gambar Produk */}
          <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
            <Image
              src={mainImageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="object-center"
            />
          </div>

          {/* Detail Produk */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Produk ID: {product.id.substring(0, 8)}...</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500 font-semibold">{product.rating.toFixed(1)}</span>
                {/* Tambahkan bintang rating di sini jika Anda punya komponen */}
                <span className="text-gray-500">({product.reviews.length} Ulasan)</span>
              </div>

              {product.discountPrice && product.discountPrice < product.price ? (
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-green-600 font-bold text-3xl">Rp {product.discountPrice.toLocaleString('id-ID')}</p>
                  <p className="text-gray-400 line-through text-lg">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              ) : (
                <p className="text-gray-900 font-bold text-3xl mb-4">Rp {product.price.toLocaleString('id-ID')}</p>
              )}

              <p className="text-gray-700 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2">
                {product.description}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              {/* Tombol WhatsApp */}
              <WhatsAppButton
                phoneNumber={phoneNumber}
                message={whatsappMessage}
                className="flex-1"
              >
                Ngobrol di WhatsApp
              </WhatsAppButton>

              {/* Tombol Favorite */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavoriteStatus} // <-- Panggil fungsi dari useFavorite hook
                disabled={isLoading}
                className={`rounded-full h-12 w-12 border-gray-300 hover:bg-gray-100 ${isFavorited ? 'text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500' : 'text-red-500'}`} /> {/* Isi ikon hati */}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;