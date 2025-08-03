'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Komponen modal untuk mengajak pengguna login
interface LoginToFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginToFavoriteModal: React.FC<LoginToFavoriteModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambahkan ke Favorit
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            Silahkan login terlebih dahulu untuk menyimpan produk ini ke daftar favorit Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleLoginClick} className="w-full bg-gradient-to-r from-black to-green-500 text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-black transition-colors">
            Login / Daftar
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Lewati untuk sekarang
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginToFavoriteModal;
