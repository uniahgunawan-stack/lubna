'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ProductEditSchema, productEditSchema } from '@/schema/editProductSchema';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {z} from 'zod';

interface FormEditProdukProps {
  name: string;
  description: string;
  price: string;
  discountPrice?: string;
  imagePreviews: { id?: string; url: string; file?: File; publicId?: string }[];
  handleAddImageInput: (files: FileList | null) => void;
  handleImageChange: (index: number, files: FileList | null) => void;
  handleRemoveImageInput: (index: number) => void;
  handleProductUpdate: (data: ProductEditSchema) => Promise<void>;
  isSubmitting: boolean;
}

export default function FormEditProduk({
  name,
  description,
  price,
  discountPrice,
  imagePreviews,
  handleAddImageInput,
  handleImageChange,
  handleRemoveImageInput,
  handleProductUpdate,
  isSubmitting,
}: FormEditProdukProps) {
  const { register, handleSubmit,  formState: { errors } } = useForm<z.infer<typeof productEditSchema>>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name,
      description,
      price: parseInt(price) || 0,
      discountPrice: discountPrice ? parseInt(discountPrice) : undefined,
      images: imagePreviews.map((img) => img.file || { id: img.id, url: img.url, order: imagePreviews.indexOf(img), publicId: img.publicId }),
    },
    });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Detail Produk</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleProductUpdate)} className="space-y-6">
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
                    src={img.url}
                    alt={`Gambar Produk ${index}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImageInput(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {index === imagePreviews.length - 1 && !img.id && (
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleImageChange(index, e.target.files)}
                    />
                  )}
                </div>
              ))}
              <label className="w-20 h-20 border-dashed border-2 flex items-center justify-center cursor-pointer">
                <PlusCircle className="h-6 w-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAddImageInput(e.target.files)}
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
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="discountPrice">Harga Diskon (Rp) (Opsional)</Label>
              <Input
                id="discountPrice"
                type="number"
                {...register('discountPrice', { valueAsNumber: true })}
              />
              {errors.discountPrice && <p className="text-red-500 text-sm">{errors.discountPrice.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Deskripsi Produk</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={5}
              placeholder="Masukkan deskripsi produk di sini. Gunakan Enter untuk baris baru."
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full sm:w-40 cursor-pointer bg-gradient-to-r from-black to-green-400 text-white hover:from-green-500 hover:to-black transition-all duration-300"
            disabled={isSubmitting}>
            Perbarui Produk
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}