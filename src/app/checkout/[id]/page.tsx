
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
    return <div className="p-20 text-center">Produto não encontrado.</div>;
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Erro", description: "Por favor, insira seu e-mail.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({ 
        title: "Sucesso!", 
        description: "Pedido recebido! As instruções foram enviadas para o seu e-mail.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para a loja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Dados do Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      E-mail para receber as credenciais
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu-email@exemplo.com"
                      className="bg-background border-border py-6 text-lg"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Nós nunca compartilhamos seu e-mail. Ele será usado apenas para a entrega do produto.
                    </p>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-4">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Método de Pagamento
                    </Label>
                    <RadioGroup defaultValue="pix" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                        <Label
                          htmlFor="pix"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <QrCode className="mb-3 h-6 w-6" />
                          PIX (Instantâneo)
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          Cartão Crédito
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="boleto" id="boleto" className="peer sr-only" />
                        <Label
                          htmlFor="boleto"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Banknote className="mb-3 h-6 w-6" />
                          Boleto Bancário
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-8 text-xl rounded-xl shadow-lg shadow-primary/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>Finalizar Compra - R$ {product.price.toFixed(2)}</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <ShieldCheck className="w-10 h-10" />
              <div className="text-sm font-bold">PAGAMENTO SEGURO SSL</div>
              <div className="text-sm font-bold">COMPRA PROTEGIDA</div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/30 border-border sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{product.name}</span>
                  <span className="font-bold">R$ {product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxas</span>
                  <span className="text-green-500">Grátis</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {product.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 text-xs text-muted-foreground">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  Acesso vitalício enquanto durar a assinatura. Suporte garantido.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
