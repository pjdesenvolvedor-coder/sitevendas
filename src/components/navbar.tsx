"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCog, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Navbar() {
  const logoImg = PlaceHolderImages.find(img => img.id === 'logo')?.imageUrl || '';

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-white/5 h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
            <Image 
              src={logoImg} 
              alt="PJ CONTAS" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight">
            <span className="text-primary">PJ</span> <span className="text-white">CONTAS</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-12 w-12 rounded-xl bg-white/5 border border-white/5">
              <UserCog className="w-6 h-6" />
            </Button>
          </Link>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl text-xs shadow-xl shadow-primary/20 uppercase tracking-widest hidden sm:flex">
            CATÁLOGO
          </Button>
          <Button size="sm" variant="ghost" className="h-12 w-12 p-0 sm:hidden">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
