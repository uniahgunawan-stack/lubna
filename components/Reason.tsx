import React from "react";
import { CheckCircle, Heart, Truck, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  {
    title: "Kualitas Premium",
    description:
      "Setiap produk kami dibuat dengan bahan terbaik dan perhatian terhadap detail, menjamin kenyamanan dan daya tahan.",
    icon: CheckCircle,
  },
  {
    title: "Desain Eksklusif",
    description:
      "Temukan gaya unik yang memadukan tradisi dengan tren modern, dirancang khusus untuk muslimah masa kini.",
    icon: Heart,
  },
  {
    title: "Pengiriman Cepat & Aman",
    description:
      "Kami memastikan pesanan Anda tiba dengan cepat dan dalam kondisi sempurna, langsung ke pintu rumah Anda.",
    icon: Truck,
  },
  {
    title: "Jaminan Kepuasan",
    description:
      "Kepuasan Anda adalah prioritas kami. Kami menawarkan kebijakan pengembalian yang mudah jika Anda tidak sepenuhnya puas.",
    icon: ShieldCheck,
  },
];

export function Reason() {
  return (
    <section className="py-2 md:py-8 bg-background text-foreground">
      <div className="container px-2 md:px-4">
        <h2 className="text-lg md:text-2xl font-bold text-center mb-2">
          Mengapa Memilih Lubna Muslimah Fashion?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="flex flex-col items-center justify-center p-2 text-center bg-card text-card-foreground border-border shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-0 flex flex-col items-center">
                <reason.icon className="h-6 w-6 text-green-500 mb-2" />
                <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
