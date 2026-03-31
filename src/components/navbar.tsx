
"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Navbar() {
  const logoImg = PlaceHolderImages.find(img => img.id === 'logo')?.imageUrl || '';

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 h-16">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
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

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-10 w-10">
              <UserCog className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-4 rounded-xl text-xs shadow-lg shadow-primary/10">
            LOJA
          </Button>
        </div>
      </div>
    </nav>
  );
}
