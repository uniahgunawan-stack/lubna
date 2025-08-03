import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import PurchaseNotification from "@/components/PurchaseNotification";
import Header from "@/components/Navbar";
import ModalProvider from "@/providers/modal-provider";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
  title: "lubna fashion",
  description: "fashion wanita kekinian",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-optima`}
      >
        <ReactQueryProvider>
          <TooltipProvider>
            <ModalProvider />
            <Toaster />
            <PurchaseNotification />
            <Header />
            {children}
            <Footer />
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
