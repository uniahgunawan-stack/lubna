// components\FormUlasan.tsx
'use client'
import { useEffect, Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ReviewSchema, reviewSchema } from '@/schema/editProductSchema';
import { Review } from '@/types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { PlusCircle, Trash2, Star, Edit } from 'lucide-react';

interface FormUlasanProps {
  product: { reviews: Review[] };
  newReviewText: string;
  setNewReviewText: Dispatch<SetStateAction<string>>;
  newReviewRating: number;
  setNewReviewRating: (rating: number) => void;
  newReviewImagePreviews: { id?: string; url: string; file?: File; publicId?: string }[];
  editingReviewId: string | null;
  handleAddReview: (data: ReviewSchema) => Promise<void>;
  handleEditReview: (review: Review) => void;
  handleDeleteReview: (reviewId: string) => Promise<void>;
  handleAddReviewImage: (files: FileList | null) => void;
  handleDeleteReviewImage: (index: number) => void;
  handleDeleteAllReviewImages: () => void;
  resetReviewState: () => void;
  isSubmitting: boolean;
}

export default function FormUlasan({
  product,
  newReviewText,
  newReviewRating,
  newReviewImagePreviews,
  editingReviewId,
  setNewReviewRating,
  handleAddReview,
  handleEditReview,
  handleDeleteReview,
  handleAddReviewImage,
  handleDeleteReviewImage,
  handleDeleteAllReviewImages,
  resetReviewState,
  isSubmitting,
}: FormUlasanProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    
    defaultValues: {
    comment: newReviewText,
    rating: newReviewRating,
    images: newReviewImagePreviews.map((img) => img.file instanceof File ? img.file : { id: img.id, url: img.url, publicId: img.publicId }),
    },
  });

  
  useEffect(() => {
    setValue('comment', newReviewText);
    setValue('rating', newReviewRating);
    
    setValue(
      'images',
      newReviewImagePreviews.map((img) => {
        if (img.file) return img.file; 
        return {
          id: img.id!,
          url: img.url,
          publicId: img.publicId,
        };
      })
    );
  }, [newReviewText, newReviewRating, newReviewImagePreviews, setValue]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Ulasan Produk ({product.reviews.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleAddReview)} className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">{editingReviewId ? 'Edit Ulasan' : 'Tambah Ulasan Baru'}</h3>
          <div>
            <Label htmlFor="reviewText">Teks Ulasan</Label>
            <Textarea
              id="reviewText"
              {...register('comment')}
              rows={3}
            />
            {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
          </div>
          <div>
            <Label htmlFor="reviewRating">Rating</Label>
             <Select
              value={newReviewRating.toString()}
              onValueChange={(value) => {
                const numValue = parseInt(value);
                setValue('rating', numValue, { shouldValidate: true });
               setNewReviewRating(numValue);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pilih Rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Bintang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
          </div>
          <div>
            <Label>Gambar Ulasan</Label>
            <div className="flex flex-wrap gap-2 mt-2"> 
              {newReviewImagePreviews.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={img.url}
                    alt={`Review ${index}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleDeleteReviewImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
              ))}
              <label className="w-20 h-20 border-dashed border-2 flex items-center justify-center cursor-pointer">
                <PlusCircle className="h-6 w-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleAddReviewImage(e.target.files);
                    // Reset input file agar bisa memilih file yang sama lagi
                    e.target.value = ''; 
                  }}
                  multiple // Izinkan upload banyak file
                />
              </label>
              <div>isi gambar ulasan dahulu karena error</div>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">
                {Array.isArray(errors.images)
                  ? errors.images.map((err, idx) => err?.message && `Gambar ${idx + 1}: ${err.message}`).filter(Boolean).join(', ')
                  : errors.images.message}
              </p>
            )}
            {editingReviewId && newReviewImagePreviews.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm" className="mt-2 w-full sm:w-auto">
                    Hapus Semua Gambar Ulasan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus semua gambar dari ulasan ini secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllReviewImages}>
                      Hapus Semua
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            {editingReviewId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetReviewState}
                className="w-full sm:w-auto"
              >
                Batal Edit
              </Button>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer sm:w-auto bg-gradient-to-r from-black to-green-400 text-white hover:from-green-500 hover:to-black transition-all duration-300"
              disabled={isSubmitting}
            >
              {editingReviewId ? 'Perbarui Ulasan' : 'Tambah Ulasan'}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {product.reviews.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Belum ada ulasan untuk produk ini.</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{review.rating} Bintang</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mb-3 line-clamp-3">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {review.images.map((img, idx) => ( 
                      <Image
                        key={idx}
                        src={img.url}
                        alt={`Review ${idx}`}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    ))}
                    
                    {review.images.length > 4 && (
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                        +{review.images.length - 2} lainnya
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReview(review)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan menghapus ulasan ini secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}