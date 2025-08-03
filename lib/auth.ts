interface User {
  id: string;
  name?: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthResponse {
  message: string;
  user: User | null;
  isAuthenticated?: boolean;
  error:string
  role?: 'ADMIN' | 'USER';
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/me');
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const data: AuthResponse = await res.json();
    if (!data.isAuthenticated || !data.user) {
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function performLogin(credentials: { email: string; password: string }): Promise<User> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const text = await res.text();
  let data: AuthResponse;
  try {
    data = text ? JSON.parse(text) : { message: 'Tidak ada data respons', user: null };
  } catch {
    throw new Error('Gagal memproses respons dari server');
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || `Login gagal dengan status ${res.status}`);
  }

  if (data.user) {
    return data.user;
  } else {
    throw new Error('Login berhasil, tetapi data pengguna tidak ditemukan.');
  }
}

export async function performRegister(payload: { email: string; password: string; name?: string }): Promise<void> {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    const errorData: ErrorResponse = text ? JSON.parse(text) : { error: 'Gagal mendaftar' };
    throw new Error(errorData.message || errorData.error || 'Gagal mendaftar');
  }
}

export async function performLogout(): Promise<void> {
  const res = await fetch('/api/logout', {
    method: 'POST',
  });
  if (!res.ok) {
    const text = await res.text();
    const errorData: ErrorResponse = text ? JSON.parse(text) : { error: 'Logout gagal' };
    throw new Error(errorData.message || errorData.error || 'Logout gagal');
  }
}