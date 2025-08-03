"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ImagePlus, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// --- Definisi Tipe ---
interface BannerImage {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
}

interface Banner {
  id: string;
  description: string;
  bannerImages: BannerImage[];
}
interface DeleteBannerResponse {
  message: string;
}

const fetchBanners = async (): Promise<Banner[]> => {
  const res = await fetch("/api/banners");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil data banner");
  }
  return res.json();
};
const createBanner = async (formData: FormData): Promise<Banner> => {
  const res = await fetch("/api/banners", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menambahkan banner");
  }
  return res.json();
};
const updateBanner = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Banner> => {
  const res = await fetch(`/api/banners/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal memperbarui banner");
  }
  return res.json();
};
const deleteBanner = async (id: string) => {
  const res = await fetch(`/api/banners/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menghapus banner");
  }
  return res.json();
};

// Helper function to truncate the description
const truncateDescription = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

export default function AdminBannersPage() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [oldPublicId, setOldPublicId] = useState<string | null>(null); // Untuk menghapus gambar lama di Cloudinary

  const {
    data: banners,
    isLoading,
    isError,
    error,
  } = useQuery<Banner[], Error>({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

  const addBannerMutation = useMutation<Banner, Error, FormData>({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner berhasil ditambahkan!");
      resetForm();
    },
    onError: (err) => {
      toast.error(`Gagal menambahkan banner: ${err.message}`);
    },
  });
  const updateBannerMutation = useMutation<
    Banner,
    Error,
    { id: string; formData: FormData }
  >({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner berhasil diperbarui!");
      resetForm();
    },
    onError: (err) => {
      toast.error(`Gagal memperbarui banner: ${err.message}`);
    },
  });

  const deleteBannerMutation = useMutation<DeleteBannerResponse, Error, string>({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner berhasil dihapus!");
    },
    onError: (err) => {
      toast.error(`Gagal menghapus banner: ${err.message}`);
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!description) {
      toast.error("Deskripsi banner harus diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    if (editingBannerId) {
      if (oldPublicId) {
        formData.append("oldPublicId", oldPublicId);
      }
      updateBannerMutation.mutate({ id: editingBannerId, formData });
    } else {
      if (!selectedImage) {
        toast.error("Pilih gambar untuk banner baru.");
        return;
      }
      addBannerMutation.mutate(formData);
    }
  };
  const handleEdit = (banner: Banner) => {
    setEditingBannerId(banner.id);
    setDescription(banner.description);
    if (banner.bannerImages && banner.bannerImages.length > 0) {
      setImagePreview(banner.bannerImages[0].url);
      setOldPublicId(banner.bannerImages[0].publicId || null);
    } else {
      setImagePreview(null);
      setOldPublicId(null);
    }
    setSelectedImage(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };
  const handleDelete = (id: string) => {
    deleteBannerMutation.mutate(id);
  };

  const resetForm = () => {
    setEditingBannerId(null);
    setDescription("");
    setSelectedImage(null);
    setImagePreview(null);
    setOldPublicId(null);

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Manajemen Banner
        </h1>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="hover:bg-orange-500 hover:text-white"
          >
            ← Kembali ke Dashboard
          </Button>
        </Link>
      </div>
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {editingBannerId ? "Edit Banner" : "Tambah Banner Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image" className="cursor-pointer">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="mt-2 object-cover border rounded-md"
                  />
                )}
                <div className="flex items-center gap-2 mt-4">
                  <ImagePlus className="h-10 w-10 text-gray-500 mb-2" />
                  <span>Pilih Gambar Banner</span>
                </div>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {editingBannerId && !selectedImage && imagePreview && (
                <p className="text-sm text-gray-500 mt-1">
                  * Biarkan kosong jika tidak ingin mengubah gambar.
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Deskripsi Banner</Label>
              <p className="text-sm md:text-lg text-gray-500 text-right mt-1">
                {description.length} / 125
              </p>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                maxLength={125}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {editingBannerId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Batal Edit
                </Button>
              )}
              <Button
                type="submit"
                className="bg-gradient-to-r !from-black !to-green-300 text-white hover:!from-green-300 hover:!to-black transition-all duration-300"
                disabled={
                  addBannerMutation.isPending || updateBannerMutation.isPending
                }
              >
                {addBannerMutation.isPending || updateBannerMutation.isPending
                  ? "Memproses..."
                  : editingBannerId
                  ? "Perbarui Banner"
                  : "Tambah Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Daftar Banner */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Memuat banner...
            </p>
          ) : isError ? (
            <p className="text-center text-red-600 dark:text-red-400 py-8">
              Error: {error?.message}
            </p>
          ) : banners && banners.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Belum ada banner. Tambahkan banner pertama Anda!
            </p>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {banners?.map((banner) => (
                <Card
                  key={banner.id}
                  className="shadow-md bg-gray-50 dark:bg-gray-800"
                >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Image
                      src={
                        banner.bannerImages.length > 0
                          ? banner.bannerImages[0].url
                          : "https://via.placeholder.com/100x100?text=No+Image"
                      }
                      alt={banner.description || "Banner image"}
                      width={96}
                      height={64}
                      className="w-24 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow overflow-hidden">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {truncateDescription(banner.description, 85)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {banner.id}
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
                        <DropdownMenuItem onClick={() => handleEdit(banner)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-500 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Apakah Anda yakin?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini akan menghapus banner ini secara
                                permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner.id)}
                                disabled={deleteBannerMutation.isPending}
                              >
                                {deleteBannerMutation.isPending
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Gambar</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners?.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <Image
                          src={
                            banner.bannerImages.length > 0
                              ? banner.bannerImages[0].url
                              : "https://via.placeholder.com/100x100?text=No+Image"
                          }
                          alt={banner.description || "Banner image"}
                          width={96}
                          height={64}
                          className="w-24 h-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {truncateDescription(banner.description, 85)}
                      </TableCell>
                      <TableCell>{banner.id}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Apakah Anda yakin?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini akan menghapus banner ini secara
                                permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner.id)}
                                disabled={deleteBannerMutation.isPending}
                              >
                                {deleteBannerMutation.isPending
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
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
