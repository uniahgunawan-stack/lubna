'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export default function AdminAuthPage() {
  const { login, register, isAuthenticating } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !name.trim()) {
      toast.error('Nama harus diisi untuk registrasi.');
      return;
    }

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password, name });
        setIsLogin(true);
      }
      console.log('Submission successful');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-green-500">
      <div className="p-16 max-w-[700px] mx-auto">
        <h2 className="text-white py-4 text-center font-bold text-3xl">
          {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-black text-xl font-bold mb-4">{isLogin ? 'Login' : 'Daftar'}</h2>
          <input
            className="text-black w-full mb-3 p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              className="text-black w-full mb-3 p-2 border rounded"
              type="text"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="text-black w-full mb-3 p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isAuthenticating}
            className="cursor-pointer w-full text-xl font-bold bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuthenticating ? 'Memproses...' : isLogin ? 'Login' : 'Daftar'}
          </button>
        </form>
        <p className="text-white text-center text-2xl mt-2 font-semibold">
          {isLogin ? 'Belum punya Akun?' : 'Sudah punya Akun?'}{' '}
          <button
            className="cursor-pointer text-2xl text-white py-2 px-4 underline"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isAuthenticating}
          >
            {isLogin ? 'Daftar' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}