'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, ImageIcon } from 'lucide-react'; 
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { AdminProductCard } from '@/components/AdminProductCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
 

export default function AdminProductsPage() {
  const { products, loading: isLoading, error, deleteProduct, togglePublish, fetchProducts } = useAdminProducts();
  const isMobile = useMediaQuery('(max-width: 768px)'); 

  
  const publishedProducts = products.filter(p => p.isPublished);
  const unpublishedProducts = products.filter(p => !p.isPublished);
  const handlelogout = useAdminProducts().handlelogout; 
  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini? Ini akan menghapus semua data dan gambar terkait.')) {
      await deleteProduct(id);
      
    }
  };

  const handleTogglePublish = async (id: string, currentPublishedStatus: boolean) => {
    await togglePublish(id, currentPublishedStatus);
    
  }; 
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Kelola Produk</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          
          <Link href="/products" className="w-full sm:w-auto">
            <Button
            className="w-full bg-gradient-to-r cursor-pointer from-black to-green-300 text-white hover:from-green-300 hover:to-black transition-all duration-300">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
            </Button>
          </Link>
          <Link href="/banners" className="w-full sm:w-auto">
            <Button variant="secondary" className="cursor-pointer w-full bg-gradient-to-r from-green-500 to-black hover:bg-gradient-to-r hover:from-black hover:to-green-500 text-white">
              <ImageIcon className="mr-2 h-4 w-4" /> Kelola Banner
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            ← Kembali ke Beranda
          </Button>
        </Link>
      </div>

      {/* Bagian Produk Yang Dipublikasikan */}
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Produk Dipublikasikan ({publishedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">Memuat produk...</p>
          ) : error ? (
            <p className="text-center text-red-600 dark:text-red-400 py-8">Error: {error}</p>
          ) : publishedProducts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Tidak ada produk yang dipublikasikan.
            </p>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {publishedProducts.map((product) => (
                <AdminProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Diskon</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishedProducts.map((product) => (
                    <AdminProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDelete}
                      onTogglePublish={handleTogglePublish}
                      isMobile={isMobile}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bagian Produk Yang Belum Dipublikasikan */}
      <div className='border-t-4 py-3'></div>
      <Card className="shadow-lg ">
        <CardHeader>
          <CardTitle className="text-lg">Produk Belum Dipublikasikan ({unpublishedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">Memuat produk...</p>
          ) : error ? (
            <p className="text-center text-red-600 dark:text-red-400 py-8">Error: {error}</p>
          ) : unpublishedProducts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Tidak ada produk yang belum dipublikasikan.
            </p>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {unpublishedProducts.map((product) => (
                <AdminProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Diskon</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unpublishedProducts.map((product) => (
                    <AdminProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDelete}
                      onTogglePublish={handleTogglePublish}
                      isMobile={isMobile}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}