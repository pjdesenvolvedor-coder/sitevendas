
"use client";

import { useState } from "react";
import { useProducts } from "@/context/products-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Boxes, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Tv
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminStockPage() {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [editingStock, setEditingStock] = useState<Record<string, string>>({});

  const handleUpdateStock = (productId: string) => {
    const newStockValue = editingStock[productId];
    if (newStockValue === undefined || newStockValue === "") {
      toast({ title: "Atenção", description: "Informe um valor para o estoque.", variant: "destructive" });
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct({
        ...product,
        stock: parseInt(newStockValue)
      });
      toast({ 
        title: "Estoque Atualizado", 
        description: `${product.name} agora possui ${newStockValue} unidades.` 
      });
      // Limpa o estado de edição para este produto
      const newEditingStock = { ...editingStock };
      delete newEditingStock[productId];
      setEditingStock(newEditingStock);
    }
  };

  const totalInventory = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-2">Estoque</h1>
        <p className="text-muted-foreground">Gerencie o volume de acessos disponíveis para cada plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total em Estoque</CardTitle>
            <Boxes className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInventory} unidades</div>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Soma de todos os produtos ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reposição Necessária</CardTitle>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{lowStockCount} produtos</div>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Itens com menos de 10 unidades</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-card/50 border-border overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary/10 shrink-0">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Tv className="w-6 h-6 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        product.stock < 10 ? "bg-red-500" : "bg-green-500"
                      )}></div>
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        product.stock < 10 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {product.stock} unidades disponíveis
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`stock-${product.id}`} className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Atribuir Novo Estoque</Label>
                    <Input 
                      id={`stock-${product.id}`}
                      type="number"
                      placeholder={product.stock.toString()}
                      className="bg-background border-border h-12 w-32 rounded-xl text-center font-bold"
                      value={editingStock[product.id] ?? ""}
                      onChange={(e) => setEditingStock({ ...editingStock, [product.id]: e.target.value })}
                    />
                  </div>
                  <Button 
                    className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
                    onClick={() => handleUpdateStock(product.id)}
                  >
                    <Save className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    product.stock < 10 ? "bg-red-500" : "bg-primary"
                  )} 
                  style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
