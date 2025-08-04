"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle, Store, ArrowLeft } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Ulasan from "./ulasan";
import { ProductDetailData } from "@/types";
import { Bouncing } from "../ui/bouncingDown";
import { ProductTransformed} from "@/actions/data";
import { useBackToHome } from "@/hooks/useBackHome";
import { Button } from "../ui/button";
import ProductListSection from "../ProductList";
import { Footer } from "../ui/footer";

interface ProductDetailViewProps {
  product: ProductDetailData;
  otherProducts: ProductTransformed[];
  mainImage: string | undefined;
  setMainImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  isStickyHeaderVisible: boolean;
  whatsappMessage: string;
  phoneNumber: string;
  fallbackImageUrl: string;
  currentImageSrc: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  otherProducts,
  mainImage,
  setMainImage,
  isStickyHeaderVisible,
  whatsappMessage,
  phoneNumber,
  fallbackImageUrl,
  currentImageSrc,
  
}) => {
  const formatPriceDisplay = product.discountPrice
    ? product.discountPrice.toLocaleString("id-ID")
    : product.price.toLocaleString("id-ID");

    const handleBackToHome = useBackToHome();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-12 md:pb-0">
      <div
        className={cn(
          "fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 shadow-md z-10000 transition-transform duration-300 ease-in-out lg:hidden",
          isStickyHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto p-4 flex items-center justify-between">
          <span className="font-semibold text-sm line-clamp-1">
            Pesan {product.name} Sekarang!
          </span>
          <WhatsAppButton
            phoneNumber={phoneNumber}
            message={whatsappMessage}
            variant="default"
            size="sm"
            className="text-sm px-3 py-1"
          >
            <MessageCircle className="mr-1 h-8 w-8" /> Order
          </WhatsAppButton>
        </div>
      </div>

      {/* buatkan deskripsi disini */}
      <div className=" md:hidden container mb-8 p-2 mx-auto items-center text-center rounded-b-lg shadow-2xl bg-gradient-to-r from-gray-900 to-green-900 text-white">
        <h2 className="text-2xl font-bold mb-4 line-clamp-1 font-['var(--font-vivaldi)']">
          💕 {product.name} 💕
        </h2>
        <p className="text-white px-3 text-center mb-2 font-semibold text-lg  mt-4 line-clamp whitespace-pre-wrap">
          {product.description}
        </p>
      </div>
      <div className="md:hidden container items-center justify-center mx-auto"></div>
      <div className="container mx-auto p-4 pt-2 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-0">
          {/* Product Images Section */}
          <div className="flex flex-col items-center">
            {/* Main Image */}
            <div className="w-full max-w-md h-[350px] mb-4 lg:h-auto lg:max-w-lg shadow-lg rounded-lg overflow-hidden relative">
              <Image
                src={currentImageSrc}
                alt={product.name}
                width={400}
                height={400}
                priority={true}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && ( // Gunakan product.images
              <div className="flex overflow-x-auto space-x-3 p-2 w-full max-w-md lg:max-w-lg scrollbar-hide">
                {product.images.map(
                  (
                    imgObj,
                    index // Gunakan product.images
                  ) => (
                    <Image
                      key={index}
                      src={imgObj.url || fallbackImageUrl}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className={cn(
                        "w-25 h-25 object-cover overflow-hidden rounded-md cursor-pointer border-2 transition-all duration-200",
                        imgObj.url === mainImage
                          ? "border-orange-500 shadow-md"
                          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                      onClick={() => setMainImage(imgObj.url)}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2 text-center md:text-start font-['var(--font-vivaldi)'] line-clamp-1">
              {product.name}
            </h1>
            <div className="flex px-14 md:px-0 items-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                ({product.rating.toFixed(1)} Bintang)
              </span>
              <span className="ml-1 text-gray-500 text-sm dark:text-gray-400">
                ({product.reviews.length} Ulasan)
              </span>
            </div>

            <div className="mb-8 text-center lg:text-start">
              <span className="mt-4 font-bold text-xl text-green-600 dark:text-green-400">
                Harga diskon hanya hari ini
              </span>
              {product.discountPrice && (
                <p className="text-2xl  text-red-500 font-bold line-through">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              )}

              <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">
                Rp {formatPriceDisplay}
              </p>
            </div>
            <div className=" text-green-700 font-semibold text-2xl mb-2 border-t-2">
              Deskripsi :
            </div>
            <div className=" text-sm md:text-xl px-2 mt-4 text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
              {product.description}
            </div>

            <WhatsAppButton
              phoneNumber={phoneNumber}
              message={whatsappMessage}
              className="w-40% h-auto py-3 text-lg hidden lg:flex"
            />
          </div>
        </div>

        <Separator className="my-1 bg-gray-200 dark:bg-gray-700" />

        <section className="container mx-auto px-4 py-2">
          <Card className="bg-gradient-to-r from-gray-900 to-green-900 text-white p-6 md:p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beli Banyak Lebih Murah, Kami Melayani Grosir!
            </h2>
            <p className="text-lg md:text-xl">
              Dapatkan harga spesial untuk pembelian dalam jumlah besar. Cocok
              untuk reseller dan kebutuhan bisnis Anda.
            </p>
            <Bouncing />
            <WhatsAppButton
              className="border-white md:hidden bg-gradient-to-b from-yellow-900 to-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 focus:ring-offset-yellow-200"
              phoneNumber={phoneNumber}
              message={whatsappMessage}
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Tanya Harga Grosir
            </WhatsAppButton>
          </Card>
        </section>

        <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
        <h1 className="font-bold text- md:text-4xl py-2 md:py-4 bg-green-200 rounded-t-4xl text-center">
          💕 Ulasan Pelanggan 💕
        </h1>
        <Ulasan
          productName={product.name}
          reviews={product.reviews}
          fallbackImageUrl={fallbackImageUrl}
        />

        <Separator className="my-0 bg-gray-200 dark:bg-gray-700" />
              <ProductListSection otherProducts={otherProducts} />
      </div>
      <div className="border-t-1 py-2 container px-4 flex mx-auto text-lg  font-bold">
        <Button
        variant={"ghost"}
          onClick={handleBackToHome}
          className="flex items-center gap-2 hover:text-blue-500 md:text-2xl"
        >
          <Store className="text-green-500 h-8 w-8" />
          <ArrowLeft className="h-4 w-4 ml-2" /> kembali
        </Button>
      </div>

      <div className="fixed bottom-2 px-2 left-0 right-0 bg-transparent dark:bg-gray-950 shadow-lg lg:hidden z-1000">
        <WhatsAppButton
          phoneNumber={phoneNumber}
          message={whatsappMessage}
          className="w-full py-3 text-lg"
        />
      </div> 
      <Footer/>     
    </div> 
  );
};

export default ProductDetailView;
