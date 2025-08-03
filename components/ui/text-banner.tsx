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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4">
          {banner.map((banner, index) => (
            <Card
              key={index}
              className="flex flex-col items-center justify-center p-2 text-center py-4 md:py-8 text-card-foreground border-border shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-0 flex flex-col items-center">
                <banner.icon className="h-8 w-8 md:h-10 md:w-10  mb-2 text-green-500" />
                <h3 className="text-lg md:text-4xl md:mb-8 font-semibold mb-2">
                  {banner.title}
                </h3>
                <p className="text-muted-foreground px-0 mb-4 md:px-4 text-sm md:text-xl md:mb-4">
                  {banner.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
