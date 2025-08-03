'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { productCreateSchema, ProductCreateSchema } from '@/schema/productadd';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';

interface FormProductProps {
  defaultValues?: Partial<ProductCreateSchema>;
}

export default function FormProduct({ defaultValues }: FormProductProps) {
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProductCreateSchema>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      price: defaultValues?.price ?? 0,
      discountPrice: defaultValues?.discountPrice ?? undefined,
      images: defaultValues?.images || [],
    },
  });

  const images = watch('images');

  useEffect(() => {
    if (defaultValues?.images && defaultValues.images.length > 0) {
      const previews = defaultValues.images.map((img) => URL.createObjectURL(img));
      setImagePreviews(previews);
    }

    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [defaultValues?.images]);

  const handleImageUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const maxSize = 5 * 1024 * 1024; // 5MB
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const newFiles = Array.from(files).filter((file): file is File => {
        if (!(file instanceof File)) return false;
        if (!validTypes.includes(file.type)) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `File ${file.name} bukan gambar yang valid (hanya JPEG, PNG, atau WebP).`,
          });
          return false;
        }
        if (file.size > maxSize) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `File ${file.name} melebihi ukuran maksimum 5MB.`,
          });
          return false;
        }
        return true;
      });

      const currentImages = watch('images') || [];
      const updatedFiles = [...currentImages, ...newFiles];
      setValue('images', updatedFiles, { shouldValidate: true });

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    [setValue, watch]
  );

  const removeImage = useCallback(
    (index: number) => {
      const currentImages = watch('images') || [];
      const previewToRemove = imagePreviews[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      const newImages = currentImages.filter((_, i) => i !== index);
      setValue('images', newImages, { shouldValidate: true });
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [imagePreviews, setValue, watch]
  );

  const onSubmit = async (data: ProductCreateSchema) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      if (data.discountPrice !== undefined && data.discountPrice !== null) {
        formData.append('discountPrice', data.discountPrice.toString());
      }

      data.images.forEach((image, index) => {
        formData.append('images', image);
        formData.append(`imageOrders[]`, index.toString());
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Gagal menambah produk: ${errorData.message || 'Terjadi kesalahan.'}`,
        });
        return;
      }

      const result = await res.json();
      toast({
        title: 'Sukses',
        description: 'Produk berhasil ditambahkan!',
      });

      reset({
        name: '',
        description: '',
        price: 0,
        discountPrice: undefined,
        images: [],
      });
      setImagePreviews([]);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan saat mengirim form.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Gambar Produk</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={img}
                    alt={`Preview ${index}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <label className="w-20 h-20 border-dashed border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
                <PlusCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">
                {Array.isArray(errors.images)
                  ? errors.images.map((err, idx) => err?.message && `Gambar ${idx + 1}: ${err.message}`).filter(Boolean).join(', ')
                  : errors.images.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                type="number"
                step="1"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="discountPrice">Harga Diskon (Opsional)</Label>
              <Input
                id="discountPrice"
                type="number"
                step="1"
                {...register('discountPrice', { valueAsNumber: true })}
              />
              {errors.discountPrice && <p className="text-red-500 text-sm">{errors.discountPrice.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={5} {...register('description')} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-black to-green-500 text-white"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah Produk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}