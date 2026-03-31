
"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useProducts } from "@/context/products-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, ShoppingCart, Tv, Play } from "lucide-react";

export default function Home() {
  const { products } = useProducts();
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero')?.imageUrl || '';
  const logoImg = PlaceHolderImages.find(img => img.id === 'logo')?.imageUrl || '';

  const categories = ['Netflix', 'Disney+', 'HBO Max', 'Prime Video', 'Star+', 'GloboPlay', 'Apple TV+'];
  const tickerItems = [...categories, ...categories];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden flex items-center min-h-[90vh]">
        <div className="absolute inset-0 -z-10 opacity-40">
          <Image 
            src={heroImg} 
            alt="Fundo Hero" 
            fill 
            className="object-cover scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] bg-primary/5">
            <Star className="w-3 h-3 mr-2 fill-primary" />
            LÍDER EM ENTRETENIMENTO PREMIUM
          </Badge>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-headline font-bold mb-6 leading-[0.9] tracking-normal">
            STREAMING SEM <br />
            <span className="text-primary italic">LIMITES.</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto font-body leading-relaxed px-4">
            Acesso instantâneo às melhores plataformas do mundo. Sem burocracia e com a confiança da <span className="pj-text">PJ</span> <span className="contas-text">CONTAS</span>.
          </p>
          <div className="flex flex-col gap-4 px-6 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto h-16 text-xl rounded-2xl font-bold shadow-2xl shadow-primary/30 uppercase tracking-widest">
              Ver Catálogo
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 text-xl rounded-2xl font-bold border-white/10 bg-white/5 hover:bg-white/10 uppercase tracking-widest">
              Suporte 24h
            </Button>
          </div>
        </div>
      </section>

      {/* Ticker Section */}
      <section className="py-12 bg-card/20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-primary/20 blur-[60px] pointer-events-none rounded-full z-0"></div>
        <div className="ticker-container pointer-events-none">
          <div className="animate-marquee flex whitespace-nowrap">
            {tickerItems.map((cat, i) => (
              <div key={i} className="ticker-item flex items-center gap-3 relative overflow-hidden group">
                <Play className="w-4 h-4 fill-current opacity-50" />
                {cat}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="produtos" className="py-16 container mx-auto px-6">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 uppercase tracking-normal">Plataformas Disponíveis</h2>
          <div className="w-20 h-1 bg-primary mb-4 mx-auto md:mx-0"></div>
          <p className="text-base text-muted-foreground max-w-md">
            Escolha seu serviço favorito e receba os dados de acesso imediato na <span className="pj-text">PJ</span> <span className="contas-text">CONTAS</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {products.filter(p => p.active).map((product) => {
            return (
              <Card key={product.id} className="group bg-card/60 border-white/5 hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                <CardHeader className="p-0">
                  <div className="relative h-56 w-full overflow-hidden">
                    {product.imageUrl && (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-100"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent"></div>
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-primary text-white border-none font-bold py-1 px-4 text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">POPULAR</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Tv className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-headline uppercase tracking-normal">{product.name}</CardTitle>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-headline font-bold text-white">R$ {product.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">/ MÊS</span>
                    </div>
                    <Link href={`/checkout/${product.id}`} className="w-full">
                      <Button className="bg-primary hover:bg-primary/90 w-full h-16 text-lg rounded-2xl font-bold gap-3 shadow-xl shadow-primary/20 uppercase tracking-[0.1em]">
                        <ShoppingCart className="w-5 h-5" />
                        ASSINAR AGORA
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10">
            <Zap className="w-14 h-14 text-primary mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 uppercase tracking-normal">Pronto para maratonar?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-sm mx-auto">
              O maior catálogo do mundo na palma da sua mão. Escolha <span className="pj-text">PJ</span> <span className="contas-text">CONTAS</span>.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 w-full max-w-xs h-16 text-xl rounded-2xl font-bold shadow-2xl shadow-primary/30 uppercase tracking-widest">
              COMEÇAR AGORA
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-black/40 border-t border-white/5 px-6">
        <div className="container mx-auto flex flex-col items-center text-center gap-10">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src={logoImg} alt="PJ CONTAS Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-headline font-bold tracking-normal">
              <span className="pj-text">PJ</span> <span className="contas-text">CONTAS</span>
            </span>
          </div>
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] max-w-xs leading-loose">
            © 2024 <span className="pj-text">PJ</span> <span className="contas-text">CONTAS</span>. ENTRETENIMENTO DE ALTA QUALIDADE ACESSÍVEL PARA TODOS OS BRASILEIROS.
          </p>
        </div>
      </footer>
    </div>
  );
}
