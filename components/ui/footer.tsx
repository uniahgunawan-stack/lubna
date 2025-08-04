import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram,} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '08568513614' ;
const whatsAppMessage =
    "Halo, saya ingin bertanya tentang produk di website Anda.";
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || '#';

export function Footer () {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <footer className="bg-gradient-to-tr from-green-500 to-black border-t">
      <div className="mx-auto py-4 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-6">
          {/* Social Media & Contact */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-white font-bold mb-2">Ikuti Kami</p>
            <div className="flex gap-4 mb-4">
              <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-8 w-8 text-white hover:text-pink-600 transition" />
              </Link>
              <Link href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-8 w-8 text-white hover:text-blue-600 transition" />
              </Link>
            </div>
             <div className="flex items-center gap-2 ">
              {/* Bungkus FaWhatsapp dan nomor telepon dengan komponen Link dan gunakan flexbox untuk meratakannya */}
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex items-center gap-2 text-white hover:text-green-500 transition"
              >
                <FaWhatsapp className="h-8 w-8 md:w-10 md:h-10" />
                <span className="text-white">Hubungi kami di {phoneNumber}</span>
              </Link>
            </div>
          </div>

          {/* Expedition Logos */}
          <div className="flex flex-col items-center md:items-start mt-6 md:mt-0">
            <p className="text-sm font-bold text-white mb-10">Tersedia Jasa Kirim</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Image src="/images/jnt.svg" alt="J&T Express" width={60} height={30} className="h-4 w-auto object-contain drop-shadow-[0_0_8px_#ffffff]" />
              <Image src="/images/jne.svg" alt="JNE" width={60} height={30} className="h-6 w-auto object-contain drop-shadow-[0_0_8px_#ffffff]" />
              <Image src="/images/lion.svg" alt="Lion Parcel" width={60} height={30} className="h-6 w-auto object-contain drop-shadow-[0_0_8px_#ffffff]" />
              <Image src="/images/jnt-cargo.png" alt="J&T Cargo" width={60} height={30} className="h-8 w-auto object-contain drop-shadow-[0_0_8px_#ffffff]" />
              <Image src="/images/pos.svg" alt="Pos Indonesia" width={60} height={30} className="h-8 w-auto object-contain drop-shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-6 md:mt-8">
          <p className="text-center text-sm text-white">
            &copy; 2024 Lubna Fashion, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
