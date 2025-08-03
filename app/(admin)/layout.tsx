import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


interface JwtPayload {
    userId: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        
        const { payload } = await jwtVerify(token, secret) as { payload: JwtPayload };

        if (payload.role !== 'ADMIN') {
            console.warn(`Akses ditolak: Pengguna dengan role '${payload.role}' mencoba mengakses dashboard admin.`);
            redirect('/');
        }

        return <>{children}</>;
    } catch (err) {
        console.error('Token tidak valid di AdminLayout:', err); 
        redirect('/login');
    }
}
