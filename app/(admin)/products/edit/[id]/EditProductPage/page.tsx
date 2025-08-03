'use client'

import { useEditProduct } from '@/hooks/useEditProduct';
import FormEditProduk from '@/components/FormEditProduct';
import FormUlasan from '@/components/FormUlasan';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EditProductPageProps {
  product: Product;
}

export default function EditProductPage({ product }: EditProductPageProps) {
  const {
    name,
    description,
    price,
    discountPrice,
    imagePreviews,
    handleAddImageInput,
    handleImageChange,
    handleRemoveImageInput,
    handleProductUpdate,
    newReviewText,
    setNewReviewText,
    newReviewRating,
    setNewReviewRating,
    newReviewImagePreviews,
    editingReviewId,
    handleAddReview,
    handleEditReview,
    handleDeleteReview,
    handleAddReviewImage,
    handleDeleteReviewImage,
    handleDeleteAllReviewImages,
    resetReviewState,
    handleCancelChanges,
    isSubmitting,
  } = useEditProduct({ product });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center sm:text-left w-full sm:w-auto">
          Edit Produk: {product.name}
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-orange-600 hover:text-white">
              Batal Perubahan & Kembali
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan membatalkan semua perubahan yang belum disimpan pada produk ini dan kembali ke dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Tidak</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelChanges}>Ya, Batalkan</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div>
        <Button
          variant="ghost"
          className="border-orange-600 text-blue-700 text-sm hover:bg-orange-600 hover:text-white"
          onClick={handleCancelChanges}
        >
          Kembali ke Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormEditProduk
          name={name}
          description={description}
          price={price}
          discountPrice={discountPrice}
          imagePreviews={imagePreviews}
          handleAddImageInput={handleAddImageInput}
          handleImageChange={handleImageChange}
          handleRemoveImageInput={handleRemoveImageInput}
          handleProductUpdate={handleProductUpdate}
          isSubmitting={isSubmitting}
        />
        <FormUlasan
          product={product}
          newReviewText={newReviewText}
          setNewReviewText={setNewReviewText}          
          newReviewRating={newReviewRating}
          setNewReviewRating={setNewReviewRating}
          newReviewImagePreviews={newReviewImagePreviews}
          editingReviewId={editingReviewId}
          handleAddReview={handleAddReview}
          handleEditReview={handleEditReview}
          handleDeleteReview={handleDeleteReview}
          handleAddReviewImage={handleAddReviewImage}
          handleDeleteReviewImage={handleDeleteReviewImage}
          handleDeleteAllReviewImages={handleDeleteAllReviewImages}
          resetReviewState={resetReviewState}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}