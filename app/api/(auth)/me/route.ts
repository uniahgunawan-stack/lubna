import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { serialize } from 'cookie';

interface JwtPayload {
  userId: string;
  email: string;
  role?: 'ADMIN' | 'USER';
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET tidak diatur di environment variable');
    }

    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Tidak ada token, akses sebagai pengguna anonim', user: null, isAuthenticated: false },
        { status: 200 }
      );
    }

    // Verifikasi token
    const secret = new TextEncoder().encode(JWT_SECRET);
    let decodedToken: JwtPayload;

    try {
      const { payload } = await jwtVerify(token, secret) as { payload: JwtPayload };
      decodedToken = payload;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      const serialized = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
      });
      return NextResponse.json(
        { message: 'Tidak terautentikasi: Token tidak valid.', user: null, isAuthenticated: false },
        { status: 401, headers: { 'Set-Cookie': serialized } }
      );
    }

    
    if (!decodedToken.userId) {
      throw new Error('Invalid token payload: userId missing');
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      const serialized = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
      });
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan.', user: null, isAuthenticated: false },
        { status: 404, headers: { 'Set-Cookie': serialized } }
      );
    }

    return NextResponse.json(
      {
        message: 'Berhasil mengambil data pengguna',
        user,
        isAuthenticated: true,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server saat mengambil data pengguna.', user: null, isAuthenticated: false },
      { status: 500 }
    );
  }
}