import React from "react";
import { getBanners, getProducts } from "@/actions/data";
import Container from "@/components/ui/container"; // Import komponen Container Anda
import ProductCard from "@/components/ProductCard";
import BannerSlider from "@/components/BannerSlider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Reason } from "@/components/Reason";
import { Footer } from "@/components/ui/footer";
import IconWhatsapp from "@/components/ui/icon-wa";
import { Banner } from "@/components/ui/text-banner";
import { Bouncing } from "@/components/ui/bouncingDown";

export default async function HomePage() {
  const banners = await getBanners();
  const latestProducts = await getProducts({
    limit: 10,
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsAppMessage =
    "Halo, saya ingin bertanya tentang produk di website Anda.";

  return (
    <Container>
      <section className="relative flex items-center justify-center text-center rounded-b-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-green-500 opacity-90"></div>
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Temukan Gaya Anda, Belanja Tanpa Batas
          </h1>
          <p className="text-lg md:text-2xl text-gray-200">
            Koleksi terbaru, kualitas terbaik, harga bersahabat. Hanya di Lubna
            Muslimah Fashion
          </p>
          <Bouncing />
          <Link href="#koleksi kami" scroll={true}>
            <Button
              size="sm"
              className="bg-white text-gradient-black hover:bg-gray-100 transition-colors duration-300 text-sm md:text-xl md:py-4 px-8 py-2 rounded-full shadow-lg"
            >
              Jelajahi Produk <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      <div className="py-4">
        <section className="mb-4">
          <h1 className="font-['var(--font-vivaldi)'] text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center"></h1>
          <Banner />
          {banners.length > 0 ? (
            <BannerSlider banners={banners} />
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500">
              Tidak ada banner tersedia saat ini.
            </div>
          )}
        </section>

        {/* Bagian Produk Terbaru */}
        <section
          id="koleksi kami"
          className="py-4 px-4  bg-white dark:bg-gray-950"
        >
          <div className="container mx-auto">
            <h2 className="bg-gray-300 py-2 rounded-t-sm text-xl shadow-lg border-b-1 md:text-3xl font-bold text-center mb-8 font-['var(--font-vivaldi)']">
              Koleksi kami
            </h2>
          </div>
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500">
              Tidak ada produk terbaru saat ini.
            </div>
          )}
          <IconWhatsapp phoneNumber={phoneNumber} message={whatsAppMessage} />
        </section>
      </div>
      <div className="border-t-2 shadow-md">
        <Reason />
      </div>
    </Container>
  );
}
