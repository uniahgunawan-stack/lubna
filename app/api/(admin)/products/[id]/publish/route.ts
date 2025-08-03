
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
 const awaitedParams = await params;
 const productId = awaitedParams.id;
const { isPublished }: { isPublished: boolean } = await req.json();

  if (!productId || typeof isPublished !== 'boolean') {
    return NextResponse.json({ message: 'ID produk atau status publish tidak valid.' }, { status: 400 });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isPublished: isPublished },
      include: { images: true }
    });

    const sanitizedProduct = {
      ...updatedProduct,
      createdAt: updatedProduct.createdAt.toISOString(),
      discountPrice: updatedProduct.discountPrice ?? null,
    };

    return NextResponse.json(sanitizedProduct, { status: 200 });

  } catch (error) {
    console.error(`Error updating publish status for product ${productId}:`, error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui status publikasi produk.' },
      { status: 500 }
    );
  }
}