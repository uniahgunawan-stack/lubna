"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import {  BannerWithImagesTransformed } from "@/actions/data";

interface BannerSliderProps {
  banners: BannerWithImagesTransformed[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  if (!banners || banners.length === 0) {
    return null;
  }
  return (
    <div className="px-4 relative w-full h-110 md:h-120 overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="mySwiper h-[100%] rounded-lg"
      >
        {banners.map((banner) => {
          const imageUrl =
            banner.bannerImages?.[0]?.url || "/placeholder-banner.jpg";
          return (
            <SwiperSlide key={banner.id} className="flex flex-col">
              <div className="relative w-full h-[75%]">
                <Image
                  src={imageUrl}
                  alt={banner.description || "Banner Image"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className=" object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {banner.description && (
                <div className=" flex-1 text-center mt-4 md:text-2xl font-semibold  ">
                  {banner.description}
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
