'use client';

import React, { useEffect, useState } from "react"; // Tambahkan useEffect dan useState
import Image from "next/image";

import { Review } from "@/types";
// Import CSS Swiper agar styling-nya berfungsi
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, A11y } from "swiper/modules";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils"; // cn untuk menggabungkan classNames

interface UlasanProps {
    productName: string;
    reviews: Review[];
    fallbackImageUrl: string;
}

const ReviewCard: React.FC<{ review: Review; fallbackImageUrl: string }> = ({ review, fallbackImageUrl }) => (
    <div className="min-w-[200px] max-w-[350px] items-center flex-shrink-0 shadow-md bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden h-full">
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "w-5 h-5",
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                        )}
                    />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{review.rating} Bintang</span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-3 line-clamp-3 flex-grow">{review.comment}</p>
            {review.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {review.images.slice(0, 2).map((imgObj, idx) => (
                        <Image
                            key={imgObj.id || idx}
                            src={imgObj.url || fallbackImageUrl}
                            alt={`Review image ${idx + 1}`}
                            width={120}
                            height={120}
                            priority
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    ))}
                    {review.images?.length > 2 && (
                        <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                            +{review.images.length - 2} lainnya
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);

const Ulasan: React.FC<UlasanProps> = ({
    productName,
    reviews,
    fallbackImageUrl,
}) => {
    // State untuk melacak apakah komponen sudah ter-mount di sisi klien
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Set isMounted menjadi true setelah komponen di-mount
        setIsMounted(true);
    }, []);

    const slideContent = reviews.map((review) => (
        <SwiperSlide key={review.id}>
            <ReviewCard review={review} fallbackImageUrl={fallbackImageUrl} />
        </SwiperSlide>
    ));

    const staticContent = reviews.map((review) => (
        <div key={review.id} className="min-w-[200px] max-w-[350px]">
            <ReviewCard review={review} fallbackImageUrl={fallbackImageUrl} />
        </div>
    ));

    return (
        <section className="mt-0 container mx-auto px-4 bg-amber-50 dark:bg-amber-900 rounded-lg p-6">
            <style jsx global>{`
                .swiper-button-next,
                .swiper-button-prev {
                    color: #6b7280; /* Warna abu-abu */
                    font-size: 1.5rem; /* Ukuran font yang lebih kecil */
                    width: 1rem;
                    height: 1rem;
                    border-radius: 9999px;
                    background-color: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(8px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: all 0.2s;
                }
                .swiper-button-next::after,
                .swiper-button-prev::after {
                    font-size: 0.5rem;
                }
                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    color: #1f2937; /* Warna abu-abu gelap saat hover */
                }
                /* Mengubah posisi navigasi agar tidak terlalu jauh */
                .swiper-button-prev {
                    left: 0.5rem;
                }
                .swiper-button-next {
                    right: 0.5rem;
                }
            `}</style>
        <p className="mb-4 font-semibold text-gray-800 dark:text-gray-200 md:text-2xl">❤️ {productName}</p>
            {reviews.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Belum ada Ulasan untuk produk ini</p>
            ) : (
                <div className="relative">
                    {/* Render Swiper hanya jika sudah ter-mount */}
                    {isMounted ? (
                        <Swiper
                            modules={[Navigation, Pagination, A11y]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            className='mySwiper'
                        >
                            {slideContent}
                        </Swiper>
                    ) : (
                        // Render versi statis (non-swiper) untuk render server
                        <div className="flex overflow-x-auto gap-4 scrollbar-hidden">
                            {staticContent}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Ulasan;
