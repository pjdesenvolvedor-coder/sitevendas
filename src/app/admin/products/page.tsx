
"use client";

import { useState } from "react";
import { useProducts } from "@/context/products-context";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Wand2, 
  Loader2, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  GripVertical,
  Tv,
  Link as LinkIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { generateProductDescription } from "@/ai/flows/admin-ai-product-description-generation";
import { useToast } from "@/hooks/use-toast";
import { StreamingService } from "@/lib/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminProductsPage() {
  const { products, addProduct, deleteProduct, updateProductsOrder } = useProducts();
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
    imageUrl: "",
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

  const onDragEndFeatures = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(formData.features);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({ ...formData, features: items });
  };

  const onDragEndProducts = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateProductsOrder(items);
    toast({ title: "Ordem Atualizada", description: "A vitrine foi reorganizada." });
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.imageUrl) {
      toast({ 
        title: "Campos Incompletos", 
        description: "Por favor, preencha nome, preço, estoque e URL da imagem.", 
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
      imageUrl: formData.imageUrl,
      active: true,
    };

    addProduct(newProduct);
    toast({ title: "Produto Salvo", description: `${formData.name} foi adicionado com sucesso.` });
    setIsAdding(false);
    setFormData({ name: "", price: "", description: "", stock: "", imageUrl: "", features: [] });
    setNewFeature("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-2 tracking-normal">Produtos</h1>
          <p className="text-muted-foreground">Arraste os cards para organizar a ordem na vitrine.</p>
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
              <DialogTitle className="font-headline text-2xl uppercase tracking-normal">Novo Serviço</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
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
                <Label htmlFor="imageUrl" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">URL da Imagem da Capa</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="imageUrl" 
                    placeholder="https://exemplo.com/imagem.jpg" 
                    className="bg-background border-border h-12 rounded-xl pl-12"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  />
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
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vantagens (Arraste para ordenar)</Label>
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
                
                <DragDropContext onDragEnd={onDragEndFeatures}>
                  <Droppable droppableId="features">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef} 
                        className="space-y-2 mt-2"
                      >
                        {formData.features.map((feature, idx) => (
                          <Draggable key={`${feature}-${idx}`} draggableId={`${feature}-${idx}`} index={idx}>
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  left: snapshot.isDragging ? provided.draggableProps.style?.left : 'auto',
                                  width: snapshot.isDragging ? '100%' : 'auto',
                                }}
                                className={cn(
                                  "flex items-center justify-between p-3 bg-background border border-border rounded-xl transition-shadow",
                                  snapshot.isDragging && "shadow-2xl border-primary ring-2 ring-primary/20 z-[9999] bg-card"
                                )}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="text-muted-foreground px-1 cursor-grab active:cursor-grabbing">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                  <span className="text-sm font-medium leading-tight">{feature}</span>
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
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
                  placeholder="Descreva as vantagens..." 
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

      <DragDropContext onDragEnd={onDragEndProducts}>
        <Droppable droppableId="products">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="grid grid-cols-1 gap-4"
            >
              {products.map((product, idx) => (
                <Draggable key={product.id} draggableId={product.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        left: snapshot.isDragging ? provided.draggableProps.style?.left : 'auto',
                      }}
                      className={cn(
                        "rounded-2xl transition-all",
                        snapshot.isDragging && "z-[9999] scale-[1.02]"
                      )}
                    >
                      <Card className={cn(
                        "bg-card/50 border-border rounded-2xl overflow-hidden group transition-shadow",
                        snapshot.isDragging && "shadow-2xl border-primary ring-2 ring-primary/20 bg-card"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="text-muted-foreground cursor-grab active:cursor-grabbing p-2">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-primary/10">
                                  {product.imageUrl ? (
                                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                  ) : (
                                    <Tv className="w-5 h-5 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm">{product.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase truncate max-w-[150px]">{product.imageUrl}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="flex flex-col text-right">
                                  <span className="font-bold text-primary text-sm">R$ {product.price.toFixed(2)}</span>
                                  <span className={`text-[10px] ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                                    {product.stock} un.
                                  </span>
                                </div>

                                <Badge className={product.active ? "bg-green-500/20 text-green-500 border-none" : "bg-muted text-muted-foreground"}>
                                  {product.active ? "Ativo" : "Inativo"}
                                </Badge>

                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl"
                                  onClick={() => setProductToDelete(product)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent className="bg-card border-border rounded-[2rem]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <AlertDialogTitle className="font-headline text-2xl text-center uppercase tracking-normal">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              Deseja excluir <strong>{productToDelete?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
            <AlertDialogCancel className="rounded-xl h-12 font-bold px-8">CANCELAR</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 rounded-xl h-12 font-bold px-8"
              onClick={() => {
                if (productToDelete) {
                  deleteProduct(productToDelete.id);
                  toast({ title: "Produto Excluído", description: "Removido com sucesso." });
                  setProductToDelete(null);
                }
              }}
            >
              EXCLUIR AGORA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
