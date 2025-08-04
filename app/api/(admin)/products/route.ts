
// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { productSchema } from '@/schema/productSchema';
import { revalidatePath } from 'next/cache';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const discountPriceStr = formData.get('discountPrice') as string | null;
    const imageFiles = formData.getAll('images') as File[];

    
    const validatedData = productSchema.safeParse({
      name,
      description,
      price: parseInt(priceStr),
      discountPrice: discountPriceStr ? parseInt(discountPriceStr) : null,
    });

    if (!validatedData.success) {
      console.error('Validation errors:', validatedData.error.flatten().fieldErrors);
      return NextResponse.json(
        { message: 'Data input tidak valid.', errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data } = validatedData;
    if (!imageFiles || imageFiles.length === 0 || !imageFiles[0].name) {
       return NextResponse.json(
        { message: 'Minimal 1 gambar produk wajib diunggah.' },
        { status: 400 }
      );
    }

    const uploadedImages = [];
    for (const file of imageFiles) {
      if (!(file instanceof File) || file.size === 0) {
        console.warn('Skipping invalid file object:', file);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload ke Cloudinary
      const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'productImage',
          resource_type: 'image',
          timeout:60000,
          transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'auto' }
              ]
        }, (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }).end(buffer);
      });

      uploadedImages.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        order: uploadedImages.length, 
      });
    }
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        rating: 0,
        isPublished: true,
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        },
      },
      include: { 
        images: true,
      }
    });
    const sanitizedProduct = {
      ...newProduct,
      createdAt: newProduct.createdAt.toISOString(),
      discountPrice: newProduct.discountPrice ?? null,
    }; revalidatePath('/');

    return NextResponse.json(sanitizedProduct, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat produk baru.' },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { 
        images: true,
      },
    });
    const sanitizedProducts = products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      
      discountPrice: product.discountPrice ?? null,
    }));

    return NextResponse.json(sanitizedProducts, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data produk untuk admin.' },
      { status: 500 }
    );
  }
}