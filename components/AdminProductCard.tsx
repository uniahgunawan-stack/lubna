'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2, Eye, EyeOff } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';

interface AdminProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
  isMobile: boolean;
}

export function AdminProductCard({ product, onDelete, onTogglePublish, isMobile }: AdminProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const defaultImage = 'https://picsum.photos/100'; // Placeholder yang andal
  const imageUrl =
    imageError || !product.images || product.images.length === 0
      ? defaultImage
      : product.images[0].url;

  // Format harga
  const formattedPrice = `Rp${product.price.toLocaleString('id-ID')}`;
  const formattedDiscountPrice = product.discountPrice
    ? `Rp${product.discountPrice.toLocaleString('id-ID')}`
    : null;

  if (isMobile) {
    return (
      <Card className="shadow-md bg-gray-50 dark:bg-gray-800">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-md"
              sizes="100px"
              onError={() => setImageError(true)} // Fallback jika gambar gagal
            />
          </div>
          <div className="flex-grow overflow-hidden">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Harga:{' '}
              {formattedDiscountPrice ? (
                <>
                  <span className="line-through mr-1">{formattedPrice}</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {formattedDiscountPrice}
                  </span>
                </>
              ) : (
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formattedPrice}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rating: {product.rating.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: {product.isPublished ? 'Published' : 'Unpublished'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                
                <Link href={`/products/edit/${product.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onTogglePublish(product.id, product.isPublished)}
                className="cursor-pointer"
              >
                {product.isPublished ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" /> Unpublished
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" /> Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(product.id)}
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <TableRow key={product.id}>
        <TableCell>
          <Image
            src={imageUrl}
            alt={product.name}
            width={100}
            height={100}
            className="w-16 h-16 object-cover rounded-md"
            onError={() => setImageError(true)} // Fallback jika gambar gagal
          />
        </TableCell>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>{formattedPrice}</TableCell>
        <TableCell>{formattedDiscountPrice ? formattedDiscountPrice : '-'}</TableCell>
        <TableCell>{product.rating.toFixed(1)}</TableCell>
        <TableCell>
          <button
            onClick={() => onTogglePublish(product.id, product.isPublished)}
            className={`py-1 px-3 rounded-md cursor-pointer text-xs transition-colors duration-200 ${
              product.isPublished
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 hover:bg-gray-500 text-gray-800'
            }`}
          >
            {product.isPublished ? 'Yes' : 'No'}
          </button>
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Link href={`/products/edit/${product.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 cursor-pointer border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-600 cursor-pointer hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}