
"use client";

import { use, useState } from "react";
import { INITIAL_PRODUCTS } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ArrowLeft, Loader2, CreditCard, Banknote, QrCode } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = INITIAL_PRODUCTS.find(p => p.id === resolvedParams.id);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  if (!product) {
    return <div className="p-20 text-center font-headline text-2xl">PRODUTO NÃO ENCONTRADO.</div>;
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Erro", description: "Por favor, insira seu e-mail.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ 
        title: "Sucesso!", 
        description: "Pedido recebido! As instruções foram enviadas para o seu e-mail.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <Navbar />
      <div className="container mx-auto px-6 max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="space-y-6">
          {/* Resumo do Pedido - Mobile First (Topo) */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline text-xl">{product.name}</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Assinatura Premium</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-headline font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card className="bg-card/50 border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    Seu E-mail de Entrega
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com"
                    className="bg-background border-border h-14 text-base rounded-xl"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground text-center">
                    As credenciais serão enviadas para este e-mail.
                  </p>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    Forma de Pagamento
                  </Label>
                  <RadioGroup defaultValue="pix" className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'pix', label: 'PIX (Automático)', icon: QrCode },
                      { id: 'card', label: 'Cartão de Crédito', icon: CreditCard },
                    ].map((method) => (
                      <div key={method.id}>
                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-4 rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                        >
                          <method.icon className="h-5 w-5 text-primary" />
                          <span className="font-bold text-sm uppercase tracking-wide">{method.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-16 text-lg rounded-2xl shadow-xl shadow-primary/20 mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>PAGAR AGORA</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-4 py-4 opacity-50">
            <div className="flex gap-4">
              <ShieldCheck className="w-8 h-8" />
              <div className="text-[10px] font-bold flex flex-col justify-center text-left">
                <span>PAGAMENTO 100% SEGURO</span>
                <span>CRIPTOGRAFIA SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
