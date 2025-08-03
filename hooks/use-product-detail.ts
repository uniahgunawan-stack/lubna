//hooks\use-product-detail.ts
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, ProductTransformed } from "@/actions/data";


interface UseProductDetailResult {
  product: ProductTransformed | undefined;
  otherProducts: ProductTransformed[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mainImage: string | undefined;
  setMainImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  isStickyHeaderVisible: boolean;
  whatsappMessage: string;
  phoneNumber: string;
  fallbackImageUrl: string;
  currentImageSrc: string;
}

export const useProductDetail = (): UseProductDetailResult => {
  const params = useParams();
  const id = params.id as string;

  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  // Fetch detail produk
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery<ProductTransformed | null, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const {
    data: otherProductsRawData,
    isLoading: isOtherProductsLoading,
    isError: isOtherProductsError,
  } = useQuery<ProductTransformed[] | null, Error>({
    queryKey: ["otherProducts", id],
    queryFn: () =>
      getProducts({ limit: 8, orderBy: "createdAt", orderDirection: "desc" }),
    enabled: !!id,
  });

  const otherProducts = useMemo(() => {
    if (!otherProductsRawData || !id) {
      return undefined;
    }
    return otherProductsRawData.filter((p) => p.id !== id);
  }, [otherProductsRawData, id]);

  useEffect(() => {
    if (productData && productData.images.length > 0) {
      setMainImage(productData.images[0]?.url);
    }
  }, [productData]);

  useEffect(() => {
    // Logika sticky header
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsStickyHeaderVisible(true);
      } else {
        setIsStickyHeaderVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tambah scroll ke atas saat halaman load
  useEffect(() => {
    if (!isProductLoading) {
      window.scrollTo(0, 0); // Reset scroll ke atas saat data selesai load
    }
  }, [isProductLoading]);

  // Constants dan perhitungan
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const fallbackImageUrl =
    "https://res.cloudinary.com/dhwnexyyb/image/upload/v1753153803/place_holder_yunmy3.jpg";

  const productUrl = `${siteUrl}/detail-product/${id}`;

  const formatPrice = useMemo(() => {
    if (!productData) return "0";
    return productData.discountPrice
      ? productData.discountPrice.toLocaleString("id-ID")
      : productData.price.toLocaleString("id-ID");
  }, [productData]);

  const whatsappMessage = useMemo(() => {
    if (!productData) return "";
    return `Halo, saya tertarik dengan produk *${productData.name}* ❤️ (${productData.name}) yang Anda jual seharga Rp${formatPrice}.
Apakah produk ini masih tersedia? Cek produk:
 ${productUrl}`;
  }, [productData, formatPrice, productUrl]);

  const currentImageSrc =
    mainImage || productData?.images?.[0]?.url || fallbackImageUrl;

  const isLoading = isProductLoading || isOtherProductsLoading;
  const isError = isProductError || isOtherProductsError || !productData;

  return {
    product: productData || undefined,
    otherProducts: otherProducts,
    isLoading,
    isError,
    mainImage,
    setMainImage,
    isStickyHeaderVisible,
    whatsappMessage,
    phoneNumber,
    fallbackImageUrl,
    currentImageSrc,
  };
};
