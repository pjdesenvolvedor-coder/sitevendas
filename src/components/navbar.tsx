
"use client";

import Link from "next/link";
import { Tv, ShieldCheck, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Tv className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tight">
            Stream<span className="text-primary italic">Pulsar</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 mr-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
            <Link href="#produtos" className="hover:text-primary transition-colors">Produtos</Link>
          </div>
          
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <UserCog className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
          
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">
            Comprar Agora
          </Button>
        </div>
      </div>
    </nav>
  );
}
