import { z } from 'zod';
const fileSchema = z.instanceof(File, { message: 'File gambar tidak valid' });

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  price: z.number()
    .min(1, 'Harga harus lebih besar dari 0')
    .int('Harga harus bilangan bulat'),
  discountPrice: z.number()
    .min(0, 'Harga diskon tidak boleh negatif')
    .int('Harga diskon harus bilangan bulat')
    .optional()
    .nullable(),
  images: z
    .array(fileSchema)
    .min(1, 'Minimal 1 gambar harus diunggah'),
});

export type ProductCreateSchema = z.infer<typeof productCreateSchema>;