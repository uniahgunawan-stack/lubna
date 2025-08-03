import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  price: z.coerce.number().min(1, 'Harga harus diisi').int('Harga harus bilangan bulat'), // Tambah .int() karena price Int
  discountPrice: z.coerce.number().optional().nullable(),
});
export type ProductSchema = z.infer<typeof productSchema>;