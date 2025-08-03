// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


interface JwtPayload {
    userId: string;
    email: string;
    role: 'ADMIN' | 'USER';
    [key: string]: any;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    
    const publicPaths = ['/login', '/register', '/']; 

   
    if (publicPaths.includes(pathname) || pathname.startsWith('/detail-product/') || pathname.startsWith('/api/auth')) {
        
        if (token && (pathname === '/login' || pathname === '/register')) {
            try {
                const secret = new TextEncoder().encode(JWT_SECRET);
                await jwtVerify(token, secret); 
                const payload = (await jwtVerify(token, secret)).payload as JwtPayload;
                if (payload.role === 'ADMIN') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                } else {
                    return NextResponse.redirect(new URL('/', request.url)); 
                }
            } catch (error) {
               
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    
    if (!token) {
        
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userRole = (payload as JwtPayload).role;

       
        if (pathname.startsWith('/dashboard') && userRole !== 'ADMIN') {
           
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error('Token verification failed in middleware:', error);
        
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Cocokkan semua jalur permintaan kecuali jalur yang memiliki:
         * - api (jalur API)
         * - _next/static (file statis)
         * - _next/image (optimasi gambar)
         * - favicon.ico (ikon favicon)
         * - Semua file di folder public
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
