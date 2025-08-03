// actions/favorite-actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/server-auth'; // Menggunakan auth dari server-auth.ts untuk mendapatkan userId

/**
 * Toggle (menambah/menghapus) produk dari daftar favorit pengguna.
 * @param productId ID produk yang akan ditoggle favoritnya.
 * @returns Object status operasi.
 */
export async function toggleFavorite(productId: string) {
  const session = await auth(); // Dapatkan sesi pengguna
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('Silahkan Login untuk menambahkan Favorits.');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: { select: { id: true } } }, // Hanya perlu ID produk favorit untuk cek
    });

    if (!user) {
      throw new Error('Pengguna tidak ditemukan.');
    }

    const isFavorited = user.favorites.some(fav => fav.id === productId);

    if (isFavorited) {
      // Hapus dari favorit
      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: productId },
          },
        },
      });
      console.log(`Produk ${productId} berhasil dihapus dari favorit pengguna ${userId}.`);
      // Revalidasi path setelah perubahan data
      revalidatePath('/favorites'); // Untuk halaman favorit
      revalidatePath('/'); // Mungkin juga homepage jika ada komponen favorit di sana
      revalidatePath(`/product/${productId}`); // Jika status favorit ditampilkan di detail produk

      return { success: true, message: 'Produk berhasil dihapus dari favorit.' };
    } else {
      // Tambahkan ke favorit
      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: { id: productId },
          },
        },
      });
      console.log(`Produk ${productId} berhasil ditambahkan ke favorit pengguna ${userId}.`);
      // Revalidasi path setelah perubahan data
      revalidatePath('/favorites'); // Untuk halaman favorit
      revalidatePath('/'); // Mungkin juga homepage
      revalidatePath(`/product/${productId}`); // Jika status favorit ditampilkan di detail produk

      return { success: true, message: 'Produk berhasil ditambahkan ke favorit.' };
    }
  } catch (error) {
    console.error('Error in toggleFavorite Server Action:', error);
    throw new Error(`Gagal memperbarui status favorit: ${error instanceof Error ? error.message : String(error)}`);
  }
}