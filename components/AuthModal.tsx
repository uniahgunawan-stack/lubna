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
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleSubscribeClick = () => {
    router.push('/login'); 
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl text-center font-bold">
            Selamat Datang di Lubna Muslim Fashion
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-center">
            Tekan tombol "Subscribe" untuk menambahkan produk favorit kamu dan nikmati pengalaman belanja yang lebih personal.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleSubscribeClick} className="w-full bg-gradient-to-r from-black to-green-500 text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-black transition-colors">
            Subscribe
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Lewati
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
