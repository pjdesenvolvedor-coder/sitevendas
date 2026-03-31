
"use client";

import Link from "next/link";
import { Tv, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 h-16">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-primary/10 transition-colors">
            <Tv className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tight">
            STREAM<span className="text-primary italic">PULSAR</span>
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
