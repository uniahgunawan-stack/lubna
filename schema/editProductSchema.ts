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

// Schema untuk edit produk
export const productEditSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  price: z.coerce
    .number()
    .refine((val) => !isNaN(val), { message: 'Harga harus berupa angka' })
    .refine((val) => val >= 1, { message: 'Harga harus lebih besar dari 0' })
    .refine((val) => Number.isInteger(val), { message: 'Harga harus bilangan bulat' }),
  discountPrice: z.coerce
    .number()
    .refine((val) => !isNaN(val), { message: 'Harga diskon harus berupa angka' })
    .refine((val) => val >= 0, { message: 'Harga diskon tidak boleh negatif' })
    .refine((val) => Number.isInteger(val), { message: 'Harga diskon harus bilangan bulat' })
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