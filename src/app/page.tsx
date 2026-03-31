import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { INITIAL_PRODUCTS } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, ShoppingCart, Tv } from "lucide-react";

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero')?.imageUrl || '';
  const logoImg = PlaceHolderImages.find(img => img.id === 'logo')?.imageUrl || '';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden flex items-center min-h-[85vh]">
        <div className="absolute inset-0 -z-10 opacity-30">
          <Image 
            src={heroImg} 
            alt="Fundo Hero" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-3 py-1 text-[10px] uppercase tracking-tighter animate-pulse">
            <Star className="w-3 h-3 mr-2 fill-primary" />
            Oferta de Inauguração: 20% OFF
          </Badge>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-headline font-bold mb-4 leading-none">
            STREAMING SEM <br />
            <span className="text-primary italic">FRONTEIRAS.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-md mx-auto font-body leading-relaxed">
            Acesso instantâneo às melhores plataformas do mundo. Sem burocracia, preço baixo e entrega imediata na <span className="text-primary font-bold">PJ CONTAS</span>.
          </p>
          <div className="flex flex-col gap-3 px-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto h-14 text-lg rounded-xl font-bold shadow-lg shadow-primary/20">
              Ver Catálogo
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg rounded-xl font-bold border-muted hover:bg-muted/50">
              Como Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 grid grid-cols-2 gap-y-6 md:grid-cols-4">
          {[
            { label: "Clientes", value: "5.000+" },
            { label: "Serviços", value: "15+" },
            { label: "Suporte", value: "24/7" },
            { label: "Entrega", value: "Imediata" }
          ].map((stat, i) => (
            <div key={i} className="text-center px-2">
              <div className="text-xl font-headline font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias - Scroll Horizontal Mobile */}
      <div className="flex overflow-x-auto gap-2 px-6 py-6 no-scrollbar md:hidden">
        {['Todos', 'Cinema', 'Séries', 'Esportes', 'Infantil', 'Premium'].map((cat) => (
          <Badge key={cat} variant="outline" className="whitespace-nowrap px-4 py-2 rounded-lg border-muted hover:border-primary transition-colors">
            {cat}
          </Badge>
        ))}
      </div>

      {/* Product Grid */}
      <section id="produtos" className="py-8 container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-headline font-bold mb-2 uppercase">Plataformas</h2>
          <p className="text-sm text-muted-foreground">
            Escolha seu serviço e comece a assistir agora.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {INITIAL_PRODUCTS.map((product) => {
            const logo = PlaceHolderImages.find(img => img.id === product.logoId)?.imageUrl || '';
            return (
              <Card key={product.id} className="group bg-card/40 border-border hover:border-primary/50 transition-all duration-300 rounded-2xl overflow-hidden shadow-xl">
                <CardHeader className="p-0">
                  <div className="relative h-40 w-full">
                    <Image 
                      src={logo} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-all duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/20 text-primary border-none font-bold">TOP</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-headline mb-3 uppercase">{product.name}</CardTitle>
                  <ul className="space-y-2 mb-6">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center text-xs gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tighter block leading-none">Apenas</span>
                      <span className="text-2xl font-headline font-bold text-white">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <Link href={`/checkout/${product.id}`} className="flex-1 max-w-[140px]">
                      <Button className="bg-primary hover:bg-primary/90 w-full h-12 text-sm rounded-xl font-bold gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        ASSINAR
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
      <section className="py-12 px-6">
        <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-headline font-bold mb-4 uppercase">Acesso Imediato?</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Receba suas credenciais segundos após a confirmação do pagamento.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 w-full max-w-xs h-14 text-lg rounded-2xl font-bold shadow-xl shadow-primary/30">
              GARANTIR MEU ACESSO
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-card/20 border-t border-border/50 px-6">
        <div className="container mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image src={logoImg} alt="PJ CONTAS Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-headline font-bold tracking-tight">
              <span className="text-primary">PJ</span> <span className="text-white">CONTAS</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            © 2024 PJ CONTAS. Todos os direitos reservados. Entretenimento acessível para todos.
          </p>
          <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest opacity-60">
            <Link href="#" className="hover:text-primary">Termos</Link>
            <Link href="#" className="hover:text-primary">Privacidade</Link>
            <Link href="#" className="hover:text-primary">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
