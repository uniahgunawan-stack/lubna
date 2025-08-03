"use client";

import React, { useEffect } from 'react';
import { toast} from "sonner";

interface PurchaseNotificationData {
  buyerName: string;
  productName: string;
}

const dummyPurchases: PurchaseNotificationData[] = [
  { buyerName: 'Dinda', productName: 'Gamis Zahira' },
  { buyerName: 'Andi', productName: 'Kemeja Pria Casual' },
  { buyerName: 'Siti', productName: 'Celana Jeans Slim Fit' },
  { buyerName: 'Budi', productName: 'Sepatu Sneakers Sporty' },
  { buyerName: 'Rina', productName: 'Tas Ransel Multifungsi' },
  { buyerName: 'Fajar', productName: 'Jam Tangan Digital' },
  { buyerName: 'Maya', productName: 'Blouse Wanita Cantik' },
  { buyerName: 'Rio', productName: 'Headphone Bluetooth' },
  { buyerName: 'Lia', productName: 'Dompet Kulit Asli' },
  { buyerName: 'Kevin', productName: 'Jaket Bomber Pria' },
  { buyerName: 'Dewi', productName: 'Rok Plisket Premium' },
  { buyerName: 'Yoga', productName: 'Topi Baseball Keren' },
  { buyerName: 'Putri', productName: 'Cincin Perak Elegan' },
  { buyerName: 'Dimas', productName: 'Kacamata Anti Radiasi' },
  { buyerName: 'Nia', productName: 'Scarf Motif Bunga' },
  { buyerName: 'Gilang', productName: 'Power Bank Fast Charging' },
  { buyerName: 'Citra', productName: 'Lipstik Matte Tahan Lama' },
  { buyerName: 'Hadi', productName: 'Parfum Pria Maskulin' },
  { buyerName: 'Vina', productName: 'Masker Wajah Organik' },
  { buyerName: 'Eko', productName: 'Gantungan Kunci Unik' },
];

const PurchaseNotification: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPurchase = dummyPurchases[Math.floor(Math.random() * dummyPurchases.length)];
      toast.success(`${randomPurchase.buyerName} baru saja membeli ${randomPurchase.productName}`, {
        position: 'bottom-left',
        duration: 4000,
        className: "bg-gradient-to-r from-black to-green-500 text-white lg:text-base lg:p-4",
      });
    }, 5 * 60 * 1000);
    const initialRandomPurchase = dummyPurchases[Math.floor(Math.random() * dummyPurchases.length)];
    toast.success(`${initialRandomPurchase.buyerName} baru saja membeli ${initialRandomPurchase.productName}`, {
      position: 'bottom-left',
      duration: 4000,
      className: "bg-gradient-to-r from-black to-green-500 text-white lg:text-base lg:p-4",
    });

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default PurchaseNotification;