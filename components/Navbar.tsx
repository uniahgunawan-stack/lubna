"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle, LayoutDashboard, Heart, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";

const Header: React.FC = () => {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, isAuthLoading, logout } = useAuth();
  const isMobile = useIsMobile();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const avatarFallbackText = user?.name
    ? user.name.substring(0, 2).toUpperCase()
    : isLoggedIn
    ? "US"
    : "GU";

  const renderDesktopMenu = () => (
    <div className="flex items-center space-x-4">
      {isAuthLoading ? (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Memuat...
        </span>
      ) : isLoggedIn ? (
        <>
          <div className="flex items-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br text-3xl font-bold from-black to-green-500 text-white">
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-xl font-medium leading-none text-gray-900 dark:text-gray-100">
                {user?.name || "Pengguna"}
              </p>
              <p className="text-lg leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          {isAdmin && (
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                size="lg"
                className="flex items-center text-lg cursor-pointer gap-1"
              >
                <LayoutDashboard className="h-8 w-8" /> Dashboard Admin
              </Button>
            </Link>
          )}
          {!isAdmin && (
            <Link href="/favorites" passHref>
              <Button
                size="lg"
                variant="ghost"
                className="flex text-lg items-center gap-1 hover:bg-gradient-to-br from-black to-green-500 hover:text-white"
              >
                <Heart className="h-8 w-8 mr-1 fill-red-500 " /> Favorit Saya
              </Button>
            </Link>
          )}
          <Button
            size="lg"
            variant="outline"
            className="flex items-center text-lg gap-1 border-red-500 cursor-pointer hover:bg-gradient-to-tr from-red-500 to-red-700 hover:text text-red-500 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-8 w-8" /> Logout
          </Button>
        </>
      ) : (
        <Link href="/login" passHref>
          <Button
            variant="ghost"
            size="lg"
            className="flex text-2xl items-center gap-1"
          >
            <UserCircle className=" bg-green-500 rounded-full h-4 w-4" /> Login
          </Button>
        </Link>
      )}
    </div>
  );

  const renderMobileMenu = () => (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-white dark:bg-gray-950 z-50">
        {" "}
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>

          <SheetDescription className="sr-only">
            Navigasi utama aplikasi
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-1">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="justify-start w-full"
              onClick={handleLinkClick}
            >
              Toko
            </Button>
          </Link>

          {isAuthLoading ? (
            <Button variant="ghost" className="justify-start w-full" disabled>
              Memuat...
            </Button>
          ) : isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-2 py-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-black to-green-500 text-white">
                    {avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {user?.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <Link href="/dashboard" passHref>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={handleLinkClick}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard Admin
                  </Button>
                </Link>
              )}
              {!isAdmin && (
                <Link href="/favorites" passHref>
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={handleLinkClick}
                  >
                    <Heart className="mr-2 h-4 w-4 fill-red-500" /> Favorit Saya
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                className="justify-start border-red-500 w-30 text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Link href="/login" passHref>
              <Button
                variant="ghost"
                className="justify-start w-full"
                onClick={handleLinkClick}
              >
                <UserCircle className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-32 px-2">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/lubna-512x512.png"
            alt="logo_toko_kamu"
            width={40}
            height={40}
            className="w-10 h-10 md:h-20 md:w-20 object-contain"
          />
          <span className="text-xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
            Lubna Fashion
          </span>
        </Link>

        {isMobile ? renderMobileMenu() : renderDesktopMenu()}
      </div>
    </header>
  );
};

export default Header;
