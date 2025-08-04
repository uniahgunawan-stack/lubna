import { z } from 'zod';

// Schema untuk validasi File
const fileSchema = z.instanceof(File, { message: 'File gambar tidak valid' });

// Schema untuk ProductImage (sesuai types.ts)
const productImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  order: z.number().int().min(0),
  publicId: z.string().optional(),
  productId: z.string().optional(),
});

// Schema untuk ReviewImage (sesuai types.ts)
const reviewImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('url gambar tidak valid'),
  publicId: z.string().optional(),
  reviewId: z.string().optional(),
});

export const productEditSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  // PERBAIKAN: Gunakan z.number() secara langsung
  price: z.number({
    error: 'Harga harus berupa angka'
  })
  .min(1, 'Harga harus lebih besar dari 0')
  .int('Harga harus bilangan bulat'),
  // PERBAIKAN: Gunakan z.number() secara langsung
  discountPrice: z.number({
    error: 'Harga diskon harus berupa angka'
  })
  .min(0, 'Harga diskon tidak boleh negatif')
  .int('Harga diskon harus bilangan bulat')
  .optional()
  .nullable(),
  images: z.array(z.union([fileSchema, productImageSchema])).optional(),
});
// Schema untuk ulasan (tambah/edit)
export const reviewSchema = z.object({
  comment: z.string().min(2, 'Komentar harus minimal 2 karakter'),
  rating: z.number().min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5'),
  images: z.array(z.union([fileSchema, reviewImageSchema])).optional(),
});

// Export tipe
export type ProductEditSchema = z.infer<typeof productEditSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;