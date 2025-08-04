'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { toggleFavorite } from '@/actions/favorits';
import { useAuth } from '@/hooks/use-auth';
import { ProductTransformed} from '@/actions/data';

interface UseFavoriteProps {
  product: ProductTransformed;
}

const useFavorite = ({ product }: UseFavoriteProps) => {
  const { user, isLoggedIn, isAuthLoading } = useAuth(); 
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (!isLoggedIn || !user) {
      setIsFavorited(false);
      return;
    }

    if (product && product.favoritedBy) {
      const initiallyFavorited = product.favoritedBy.some (favUser => favUser.id === user.id);
      setIsFavorited(initiallyFavorited);
    } else {
      setIsFavorited(false);
    }
  }, [ user, isLoggedIn, isAuthLoading, product]);

    const toggleFavoriteStatus = useCallback (async() => {
        if (!isLoggedIn) {
          toast.error ('Anda harus login untuk menambahkan ke favorite.');
          return;
        }
        setIsLoading(true);
        try {
          const result = await toggleFavorite(product.id);
          setIsFavorited(prev => !prev);
          toast.success(result.message);
        } catch (error) {
          console.error ('Gagal toggel favorite', error);
          toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui favorite.');
        } finally {
          setIsLoading(false);
        }
    }, [isLoggedIn, product.id]);

    return {
      isFavorited, isLoading, toggleFavoriteStatus, userLoggedIn: isLoggedIn,
    };
    
  };
export default useFavorite;