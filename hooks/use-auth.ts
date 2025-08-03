'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { fetchCurrentUser, performLogin, performLogout, performRegister } from '@/lib/auth';

interface User {
  id: string;
  name?: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading: isAuthLoading,
    isError: isAuthError,
    error: authError,
    refetch: refetchCurrentUser,
  } = useQuery<User | null, Error>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: true,
  });

 const loginMutation = useMutation<User, Error, AuthPayload>({
  mutationFn: performLogin,
  onSuccess: async (loggedInUser) => {
    toast.success(`Login berhasil! Selamat datang, ${loggedInUser.name || loggedInUser.email}!`);
    queryClient.setQueryData(['currentUser'], loggedInUser);
    if (loggedInUser.role === 'ADMIN') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  },
  onError: (err) => {
    toast.error(err.message || 'Terjadi kesalahan saat login');
    console.log('Login error caught in mutation:', err.message); 
  },
});

  const registerMutation = useMutation<void, Error, AuthPayload>({
    mutationFn: performRegister,
    onSuccess: () => {
      toast.success(`Akun berhasil dibuat! Silakan login.`);
      router.push('/login');
    },
    onError: (err) => {
      toast.error(`Registrasi gagal: ${err.message || 'Terjadi kesalahan'}`);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: performLogout,
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      toast.info('Anda telah logout.');
      router.push('/');
      router.refresh();
    },
    onError: (err) => {
      toast.error(`Gagal logout: ${err.message || 'Terjadi kesalahan'}`);
    },
  });

  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';
  const isLoggedIn = !!user;

  return {
    user,
    isLoggedIn,
    isAdmin,
    isUser,
    isAuthLoading: isAuthLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    authError,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    refetchCurrentUser,
    isAuthenticating: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
}