
"use client";

import { useState } from "react";
import { INITIAL_PRODUCTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit3, Trash2, Wand2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateProductDescription } from "@/ai/flows/admin-ai-product-description-generation";
import { useToast } from "@/hooks/use-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: ""
  });

  const handleAiGenerate = async () => {
    if (!formData.name) {
      toast({ title: "Erro", description: "Insira o nome do produto primeiro.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProductDescription({ 
        productDetails: `${formData.name}, premium streaming, multiple profiles, ultra HD quality` 
      });
      setFormData({ ...formData, description: result.description });
      toast({ title: "Sucesso", description: "Descrição gerada com IA!" });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao gerar descrição.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProduct = () => {
    // Basic validation
    if (!formData.name || !formData.price) return;
    
    toast({ title: "Produto Salvo", description: `${formData.name} foi adicionado com sucesso.` });
    setIsAdding(false);
    setFormData({ name: "", price: "", description: "", stock: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-2">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seus serviços de streaming e estoque.</p>
        </div>

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2 font-bold py-6 px-6">
              <Plus className="w-5 h-5" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Adicionar Novo Serviço</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider">Nome do Serviço</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Netflix Premium 4K" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-bold uppercase tracking-wider">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="19.90"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-bold uppercase tracking-wider">Estoque Inicial</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider">Descrição</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1 text-primary hover:text-primary/80 hover:bg-primary/5 font-bold"
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    Gerar com IA
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  rows={4} 
                  placeholder="Descreva as vantagens do serviço..." 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
              <Button className="bg-primary hover:bg-primary/90 font-bold" onClick={handleSaveProduct}>Salvar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center gap-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar produtos..." 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[300px]">Serviço</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-bold">{product.name}</TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-red-500 font-bold" : ""}>
                      {product.stock} un.
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={product.active ? "bg-green-500/20 text-green-500 border-none" : "bg-muted text-muted-foreground"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
