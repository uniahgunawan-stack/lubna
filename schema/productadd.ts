import { z } from 'zod';

// Schema untuk validasi File (menggunakan instanceof File)
const fileSchema = z.instanceof(File, { message: 'File gambar tidak valid' });

// Schema untuk create produk baru
export const productCreateSchema = z.object({
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
  images: z
    .array(fileSchema)
    .min(1, 'Minimal 1 gambar harus diunggah'),
});

// Infer tipe dari schema
export type ProductCreateSchema = z.infer<typeof productCreateSchema>;