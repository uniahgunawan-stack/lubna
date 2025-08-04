'use client';

import React, { useState } from 'react';
import { ProductTransformed } from '@/actions/data';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface ProductListSectionProps {
  otherProducts: ProductTransformed[];
}

const ProductListSection: React.FC<ProductListSectionProps> = ({ otherProducts }) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const productsToShow = otherProducts.slice(0, visibleCount);
  const hasMore = visibleCount < otherProducts.length;

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  if (otherProducts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-xl font-bold text-center mb-8">
          Lihat Produk Lainnya yang Mungkin Anda Suka
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          Tidak ada produk lain yang tersedia saat ini.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-4">
      <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
      <h2 className="text-xl font-bold text-center mb-8">
        Lihat Produk Lainnya yang Mungkin Anda Suka
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-4">
        {productsToShow.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <Button variant="outline" className="px-6 py-2" onClick={handleShowMore}>
            Tampilkan Produk Lainnya
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProductListSection;