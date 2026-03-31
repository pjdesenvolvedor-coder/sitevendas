
"use client";

import { use, useState } from "react";
import { useProducts } from "@/context/products-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ArrowLeft, Loader2, QrCode, User, Phone } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { products } = useProducts();
  const product = products.find(p => p.id === resolvedParams.id);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: ""
  });

  if (!product) {
    return <div className="p-20 text-center font-headline text-2xl text-white">PRODUTO NÃO ENCONTRADO.</div>;
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast({ 
        title: "Campos Incompletos", 
        description: "Por favor, preencha todos os seus dados para continuar.", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    // Simulação de processamento de pedido
    setTimeout(() => {
      setLoading(false);
      toast({ 
        title: "Pedido Gerado!", 
        description: "Seu código PIX foi gerado e enviado para o seu WhatsApp.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-background">
      <Navbar />
      <div className="container mx-auto px-6 max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 text-sm font-bold uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 rounded-2xl overflow-hidden border-dashed">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline text-2xl text-white">{product.name}</h2>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Acesso Premium Vitalício</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-headline font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
            <CardHeader className="pt-8 text-center">
              <CardTitle className="font-headline text-3xl uppercase tracking-normal">Dados do Cliente</CardTitle>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Informações para entrega do produto</p>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <form onSubmit={handleCheckout} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="fullName" 
                      placeholder="Ex: João Silva"
                      className="bg-background border-white/5 h-14 pl-12 rounded-xl focus:ring-primary"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    WhatsApp / Contato
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      className="bg-background border-white/5 h-14 pl-12 rounded-xl focus:ring-primary"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <Separator className="bg-white/5 my-6" />

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Forma de Pagamento
                  </Label>
                  <div className="flex items-center gap-4 rounded-2xl border-2 border-primary bg-primary/5 p-5 transition-all">
                    <div className="bg-primary p-2 rounded-lg">
                      <QrCode className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="block font-bold text-sm uppercase tracking-widest text-white">PIX Automático</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Liberação imediata após o pagamento</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-16 text-lg rounded-2xl shadow-2xl shadow-primary/20 mt-6 uppercase tracking-widest"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>GERAR CÓDIGO PIX</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-6 py-8 opacity-40">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div className="text-[9px] font-bold flex flex-col justify-center text-left leading-tight tracking-wider uppercase">
                  <span>PAGAMENTO</span>
                  <span>100% SEGURO</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-[9px] font-bold flex flex-col justify-center text-left leading-tight tracking-wider uppercase">
                <span>ENTREGA</span>
                <span>IMEDIATA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
