
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { INITIAL_PRODUCTS } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, ShoppingCart, Tv } from "lucide-react";

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero')?.imageUrl || '';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <Image 
            src={heroImg} 
            alt="Hero Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-primary text-primary px-4 py-1 animate-pulse">
            <Star className="w-3 h-3 mr-2 fill-primary" />
            Oferta de Inauguração: 20% OFF
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Entretenimento Sem Limites, <br />
            <span className="text-primary italic">No Seu Controle.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-body">
            Acesso instantâneo às melhores plataformas de streaming do mundo. Preços imbatíveis e entrega imediata sem burocracia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-full font-bold">
              Ver Catálogo
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full font-bold border-muted hover:bg-muted/50">
              Como Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Clientes Satisfeitos", value: "5.000+" },
            { label: "Serviços Disponíveis", value: "15+" },
            { label: "Suporte", value: "24/7" },
            { label: "Tempo de Entrega", value: "Imediato" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-headline font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="produtos" className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Plataformas Disponíveis</h2>
            <p className="text-muted-foreground max-w-lg">
              Escolha seu serviço favorito e comece a assistir agora mesmo.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Badge className="bg-muted text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer">Todos</Badge>
            <Badge variant="outline" className="hover:border-primary transition-colors cursor-pointer">Cinema</Badge>
            <Badge variant="outline" className="hover:border-primary transition-colors cursor-pointer">Séries</Badge>
            <Badge variant="outline" className="hover:border-primary transition-colors cursor-pointer">Esportes</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INITIAL_PRODUCTS.map((product) => {
            const logo = PlaceHolderImages.find(img => img.id === product.logoId)?.imageUrl || '';
            return (
              <Card key={product.id} className="group relative bg-card/50 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={logo} 
                      alt={product.name} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="premium-gradient border-none text-white shadow-lg">Popular</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-headline mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {product.description}
                  </p>
                  <ul className="space-y-3">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border/50 mt-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest block">A partir de</span>
                    <span className="text-2xl font-headline font-bold text-white">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <Link href={`/checkout/${product.id}`}>
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-6 font-bold gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Assinar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary/5 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-primary mx-auto mb-6 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Pronto para começar?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                Não perca mais tempo. Tenha acesso imediato aos melhores conteúdos do mundo hoje mesmo.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-12 py-8 text-xl rounded-full font-bold shadow-xl shadow-primary/30">
                Garantir meu Acesso
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Tv className="w-6 h-6 text-primary" />
            <span className="text-xl font-headline font-bold">
              Stream<span className="text-primary">Pulsar</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 StreamPulsar. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-primary">Termos</Link>
            <Link href="#" className="hover:text-primary">Privacidade</Link>
            <Link href="#" className="hover:text-primary">Ajuda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
