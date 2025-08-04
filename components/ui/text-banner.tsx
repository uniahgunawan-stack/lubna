import React from "react";
import { CheckCircle, Shirt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const banner = [
  {
    title: "Gaya Muslimah Modern yang Tetap Santun",
    description:
      "Tampil percaya diri dengan koleksi fashion muslimah terkini dari Lubna Fashion. Gamis elegan, midi stylish, hingga setelan modest yang nyaman untuk semua aktivitas",
    icon: CheckCircle,
  },
  {
    title: "Simpel, Syar'i, dan Siap Kirim Grosir",
    description:
      "Tampil istimewa di setiap momen bersama koleksi LubnaFashion. Gaya sopan, bahan nyaman, dan potongan modern untuk para ibu rumah tangga aktif. Belanja eceran atau grosir? Semua bisa di sini.",
    icon: Shirt,
  },
];

export function Banner() {
    return (
    <section>
      <div className="container px-2 md:px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {banner.map((banner, index) => (
            <div
              key={index}
              // Tambahkan kelas Tailwind 'border-none' di sini
              className="flex flex-col px-2 items-center justify-center text-center  border-none"
            >
              <CardContent className="p-0 flex flex-col items-center">
                <banner.icon className="h-8 w-8 md:h-10 md:w-10 mb-2 text-green-500" />
                <h3 className="text-lg md:text-2xl md:mb-8 font-bold mb-2">
                  {banner.title}
                </h3>
                <p className="text-muted-foreground px-0 mb-4 md:px-4 text-sm md:text-lg ">
                  {banner.description}
                </p>
              </CardContent>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
