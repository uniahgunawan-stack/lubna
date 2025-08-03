
'use client';

import ProductDetailView from '@/components/product/ProductDetail';
import { useProductDetail } from '@/hooks/use-product-detail';
import { notFound } from 'next/navigation';

export default function ProductDetailPage() {
    const {
        product,
        otherProducts,
        isLoading,
        isError,
        mainImage,
        setMainImage,
        isStickyHeaderVisible,
        whatsappMessage,
        phoneNumber,
        fallbackImageUrl,
        currentImageSrc,
    } = useProductDetail();
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <p className="text-xl font-semibold">Memuat detail produk...</p>
            </div>
        );
    }
    if (isError || !product) {
        
        return (
           <div className="flex justify-center items-center min-h-screen bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200">
             <p className="text-xl font-semibold">Produk tidak ditemukan atau terjadi kesalahan saat memuat.</p>
             </div>)
        
    }

    return (
        <ProductDetailView
            product={product} 
            otherProducts={otherProducts || []} 
            mainImage={mainImage}
            setMainImage={setMainImage}
            isStickyHeaderVisible={isStickyHeaderVisible}
            whatsappMessage={whatsappMessage}
            phoneNumber={phoneNumber}
            fallbackImageUrl={fallbackImageUrl}
            currentImageSrc={currentImageSrc}
        />
    );
}
