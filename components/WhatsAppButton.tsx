import React from 'react';
import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';


interface WhatsAppButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  phoneNumber: string;
  message: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, message, className, variant = 'default', size = 'default', ...props }) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className={cn("bg-gradient-to-r from-black to-green-500 !text-white hover:from-green-500 hover:to-black transition-all duration-300", className)}
      variant={variant}
      size={size}
      {...props}
    >
      <FaWhatsapp className="h-8 w-8" />
      Ngobrol di WhatsApp
    </Button>
  );
};

export default WhatsAppButton;