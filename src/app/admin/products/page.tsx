
"use client";

import { useState } from "react";
import { useProducts } from "@/context/products-context";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit3, Trash2, Wand2, Loader2, AlertCircle, X, CheckCircle2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateProductDescription } from "@/ai/flows/admin-ai-product-description-generation";
import { useToast } from "@/hooks/use-toast";
import { StreamingService } from "@/lib/types";

const LOGO_OPTIONS = [
  { id: 'netflix', name: 'Netflix' },
  { id: 'disney', name: 'Disney+' },
  { id: 'max', name: 'HBO Max' },
  { id: 'prime', name: 'Prime Video' },
];

export default function AdminProductsPage() {
  const { products, addProduct, deleteProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productToDelete, setProductToDelete] = useState<StreamingService | null>(null);
  const { toast } = useToast();

  const [newFeature, setNewFeature] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    logoId: "netflix",
    features: [] as string[]
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

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast({ 
        title: "Campos Incompletos", 
        description: "Por favor, preencha nome, preço e estoque.", 
        variant: "destructive" 
      });
      return;
    }
    
    const newProduct: StreamingService = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      stock: parseInt(formData.stock),
      features: formData.features.length > 0 ? formData.features : ["Acesso imediato", "Suporte 24h"],
      logoId: formData.logoId,
      active: true,
    };

    addProduct(newProduct);
    toast({ title: "Produto Salvo", description: `${formData.name} foi adicionado com sucesso.` });
    setIsAdding(false);
    setFormData({ name: "", price: "", description: "", stock: "", logoId: "netflix", features: [] });
    setNewFeature("");
  };

  const confirmDelete = (product: StreamingService) => {
    setProductToDelete(product);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast({ 
        title: "Produto Excluído", 
        description: `${productToDelete.name} foi removido do catálogo.`,
        variant: "default"
      });
      setProductToDelete(null);
    }
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
            <Button className="bg-primary hover:bg-primary/90 gap-2 font-bold py-6 px-6 rounded-2xl">
              <Plus className="w-5 h-5" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-card border-border rounded-[2rem] max-h-[90vh] overflow-y-auto no-scrollbar">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl uppercase tracking-tight">Novo Serviço</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome do Serviço</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Netflix Premium 4K" 
                    className="bg-background border-border h-12 rounded-xl"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ícone / Logo</Label>
                  <Select 
                    value={formData.logoId} 
                    onValueChange={(val) => setFormData({...formData, logoId: val})}
                  >
                    <SelectTrigger className="bg-background border-border h-12 rounded-xl">
                      <SelectValue placeholder="Selecione o logo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {LOGO_OPTIONS.map(opt => (
                        <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="19.90"
                    className="bg-background border-border h-12 rounded-xl"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estoque</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="50"
                    className="bg-background border-border h-12 rounded-xl"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vantagens do Produto</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: 4 Telas simultâneas" 
                    className="bg-background border-border h-12 rounded-xl flex-1"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button 
                    type="button" 
                    onClick={addFeature}
                    className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-2 mt-2">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => removeFeature(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic text-center py-2">Nenhuma vantagem adicionada. Usaremos as padrões.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Descrição</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1 text-primary hover:text-primary/80 hover:bg-primary/5 font-bold rounded-lg"
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    Gerar com IA
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  rows={3} 
                  placeholder="Descreva as vantagens do serviço..." 
                  className="bg-background border-border rounded-xl resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 pb-4">
              <Button variant="outline" className="rounded-xl h-12 font-bold flex-1" onClick={() => setIsAdding(false)}>CANCELAR</Button>
              <Button className="bg-primary hover:bg-primary/90 font-bold rounded-xl h-12 px-8 flex-1" onClick={handleSaveProduct}>SALVAR PRODUTO</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-border rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border bg-muted/10">
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Serviço</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Preço</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Estoque</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Status</TableHead>
                <TableHead className="text-right font-bold uppercase tracking-widest text-[10px] h-14">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-bold py-6">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-normal">{product.logoId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-red-500 font-bold" : "font-medium"}>
                      {product.stock} un.
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={product.active ? "bg-green-500/20 text-green-500 border-none px-3" : "bg-muted text-muted-foreground px-3"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 hover:text-red-500 rounded-xl hover:bg-red-500/5"
                        onClick={() => confirmDelete(product)}
                      >
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

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent className="bg-card border-border rounded-[2rem]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <AlertDialogTitle className="font-headline text-2xl text-center uppercase">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              Você tem certeza que deseja excluir <strong>{productToDelete?.name}</strong>? 
              <br />Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
            <AlertDialogCancel className="rounded-xl h-12 font-bold px-8">CANCELAR</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 rounded-xl h-12 font-bold px-8"
              onClick={handleDelete}
            >
              EXCLUIR AGORA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
