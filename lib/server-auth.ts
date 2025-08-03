// lib/server-auth.ts
// Ini adalah fungsi khusus untuk digunakan di Server Components (misalnya di page.tsx)

import 'server-only';
import { cookies } from 'next/headers'; // <--- Perhatikan import ini
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

interface JwtPayload {
  userId: string;
  email: string;
}

interface AuthSession {
  user: {
    id: string;
    name?: string | null;
    email: string;
    role: 'ADMIN' | 'USER';
  } | null;
}

export async function auth(): Promise<AuthSession> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;

    if (!token) {
      return { user: null };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret');
    let decodedToken: JwtPayload;

    try {
      const { payload } = await jwtVerify(token, secret) as { payload: JwtPayload };
      decodedToken = payload;
    } catch (jwtError) {
      console.error('JWT verification failed in server-auth:', jwtError);
      return { user: null };
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
      return { user: null };
    }

    return { user };
  } catch (error) {
    console.error('Error in server-auth:', error);
    return { user: null };
  }
}