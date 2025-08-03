'use client'

import { useState, useEffect, useCallback, } from 'react'
import { Product } from '@/types'
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export function useAdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengambil data produk');
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal saat mengambil produk.');
      toast({
          variant: 'destructive',
          title: 'Error',
          description: error,
      });
    } finally {
      setLoading(false);
    }
  }, []);
   useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


 const deleteProduct = useCallback(async (id: string) => {
    try {
      
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus produk');
      }
      toast({
        title: 'Sukses',
        description: 'Produk berhasil dihapus!',
      });
      fetchProducts();
      router.refresh();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus produk.',
      });
    }
  }, [fetchProducts, router]);

const togglePublish = useCallback(async (id: string, currentPublishedStatus: boolean) => {
    try {
      
      const res = await fetch(`/api/products/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !currentPublishedStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengubah status publikasi produk');
      }
      toast({
        title: 'Sukses',
        description: `Produk berhasil di${!currentPublishedStatus ? 'publikasikan' : 'unpublikasikan'}!`,
      });
      fetchProducts();
      router.refresh();
    } catch (err) {
      console.error('Error toggling publish status:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengubah status publikasi.',
      });
    }
  }, [fetchProducts, router]);

  const handlelogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        console.log('User logged out successfully');
        alert('Anda berhasil logout!');
        router.push('/login');
      } else {
        const errorData = await res.json();
        console.error('Logout failed:', errorData.message);
        alert(`Gagal logout: ${errorData.message || 'Terjadi kesalahan.'}`);
      }
    } catch (err) {
      console.error('Error during logout:', err);
      alert('Terjadi kesalahan jaringan saat logout.');
    }
  };

  

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    togglePublish,
    handlelogout,
  }
}