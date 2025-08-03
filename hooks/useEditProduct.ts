// hooks\useEditProduct.ts
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Product, ProductImage, Review, ReviewImage } from '@/types';
import { ProductEditSchema, ReviewSchema } from '@/schema/editProductSchema';
import { useQueryClient } from '@tanstack/react-query';


interface UseEditProductProps {
  product: Product;
}

interface ImagePreview {
  id?: string;
  url: string;
  file?: File;
  publicId?: string;
}

export function useEditProduct({ product }: UseEditProductProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '0');
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice?.toString() || '');
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  // newReviewText, newReviewRating, newReviewImagePreviews sekarang dipegang oleh react-hook-form
  // Hapus state ini jika Anda sepenuhnya mengandalkan react-hook-form untuk input
  // Jika Anda masih ingin mengelola state ini secara terpisah untuk UI, pastikan sinkronisasinya benar
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const [newReviewImagePreviews, setNewReviewImagePreviews] = useState<ImagePreview[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi preview gambar produk
  useEffect(() => {
    if (product?.images) {
      const previews = product.images.map((img: ProductImage) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        order: img.order, // Pastikan order disertakan
      }));
      setImagePreviews(previews);
    }

    return () => {
      // Membersihkan Object URLs saat komponen unmount
      imagePreviews.forEach((preview) => {
        if (preview.file) URL.revokeObjectURL(preview.url);
      });
    };
  }, [product?.images]); // Dependensi hanya product.images

  // Tambah input gambar produk
  const handleAddImageInput = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  // Ubah gambar produk di indeks tertentu
  const handleImageChange = useCallback((index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const newUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => {
      const updated = [...prev];
      if (updated[index].file) URL.revokeObjectURL(updated[index].url);
      updated[index] = { url: newUrl, file };
      return updated;
    });
  }, []);

  // Hapus gambar produk
  const handleRemoveImageInput = useCallback((index: number) => {
    setImagePreviews((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed.file) URL.revokeObjectURL(removed.url);
      return updated;
    });
  }, []);

  // Submit update produk
  const handleProductUpdate = useCallback(
    async (data: ProductEditSchema) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        if (data.discountPrice !== undefined && data.discountPrice !== null) {
          formData.append('discountPrice', data.discountPrice.toString());
        }

       imagePreviews.forEach((preview, index) => {
          if (preview.file) {
            // Gambar baru
            formData.append('images', preview.file); // Mengirim file langsung
            formData.append(`imageOrders[]`, index.toString());
          } else if (preview.id) {
            // Gambar yang sudah ada di database
            formData.append(
              'existingImages[]',
              JSON.stringify({
                id: preview.id,
                url: preview.url,
                publicId: preview.publicId || '',
                order: index,
              })
            );
          }
        });

        const res = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal memperbarui produk');
        }
        queryClient.invalidateQueries({ queryKey: ['products'] });

        toast({
          title: 'Sukses',
          description: 'Produk berhasil diperbarui!',
        });
        router.push('/dashboard');
      } catch (error) {
        
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui produk.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [product?.id, router, imagePreviews]
  );

  // Tambah/edit ulasan
  const handleAddReview = useCallback(
    async (data: ReviewSchema) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('comment', data.comment);
        formData.append('rating', data.rating.toString());

        const imagesToKeep: { id?: string; url: string; publicId?: string }[] = [];
            const newImageFiles: File[] = [];

       (data.images || []).forEach((image) => {
                if (image instanceof File) {
                    // Ini adalah File baru yang diupload
                    newImageFiles.push(image);
                } else {
                    // Ini adalah gambar yang sudah ada dari database (ReviewImage)
                    imagesToKeep.push({
                        id: image.id,
                        url: image.url,
                        publicId: image.publicId || '',
                    });
                }
            });

            formData.append('existingImages', JSON.stringify(imagesToKeep));

            // Kirim gambar baru sebagai File
            newImageFiles.forEach(file => {
                formData.append('images', file);
            });

        const endpoint = editingReviewId
          ? `/api/products/${product.id}/reviews` 
          : `/api/products/${product.id}/reviews`;
        const method = editingReviewId ? 'PUT' : 'POST';

        // Jika mengedit, sertakan reviewId dalam FormData
        if (editingReviewId) {
          formData.append('reviewId', editingReviewId);
        }

        const res = await fetch(endpoint, {
          method,
          body: formData,
        });
        queryClient.invalidateQueries({ queryKey: ['reviews'] });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Gagal ${editingReviewId ? 'memperbarui' : 'menambahkan'} ulasan`);
        }

        toast({
          title: 'Sukses',
          description: `Ulasan berhasil ${editingReviewId ? 'diperbarui' : 'ditambahkan'}!`,
        });
        resetReviewState();
        router.refresh();
      } catch (error) {
        
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Terjadi kesalahan saat menangani ulasan.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [product?.id, editingReviewId, router]
  );

  // Edit ulasan
  const handleEditReview = useCallback((review: Review) => {
    setEditingReviewId(review.id);
    setNewReviewText(review.comment);
    setNewReviewRating(review.rating);
    setNewReviewImagePreviews(
      review.images.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
      }))
    );
  }, []);

  // Hapus ulasan
  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        // Perbaikan: Sesuaikan endpoint DELETE jika reviewId di URL
        const res = await fetch(`/api/products/${product.id}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal menghapus ulasan');
        }

        toast({
          title: 'Sukses',
          description: 'Ulasan berhasil dihapus!',
        });
        router.refresh();
      } catch (error) {
        
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus ulasan.',
        });
      }
    },
    [router]
  );

  // Tambah gambar ulasan
  const handleAddReviewImage = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setNewReviewImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  // Hapus gambar ulasan
  const handleDeleteReviewImage = useCallback((index: number) => {
    setNewReviewImagePreviews((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed.file) URL.revokeObjectURL(removed.url);
      return updated;
    });
  }, []);

  // Hapus semua gambar ulasan
  const handleDeleteAllReviewImages = useCallback(() => {
    setNewReviewImagePreviews((prev) => {
      prev.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
      return [];
    });
  }, []);

  // Reset state ulasan
  const resetReviewState = useCallback(() => {
    setNewReviewText('');
    setNewReviewRating(1);
    setNewReviewImagePreviews((prev) => {
      prev.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
      return [];
    });
    setEditingReviewId(null);
  }, []);

  // Batal perubahan
  const handleCancelChanges = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return {
    // State produk
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    imagePreviews,
    // Handler produk
    handleAddImageInput,
    handleImageChange,
    handleRemoveImageInput,
    handleProductUpdate,
    // State ulasan
    newReviewText,
    setNewReviewText,
    newReviewRating,
    setNewReviewRating,
    newReviewImagePreviews,
    editingReviewId,
    // Handler ulasan
    handleAddReview,
    handleEditReview,
    handleDeleteReview,
    handleAddReviewImage,
    handleDeleteReviewImage,
    handleDeleteAllReviewImages,
    resetReviewState,
    // Handler umum
    handleCancelChanges,
    isSubmitting,
  };
}