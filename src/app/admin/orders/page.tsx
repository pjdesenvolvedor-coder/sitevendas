
"use client";

import { useState } from "react";
import { INITIAL_ORDERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Mail, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const { toast } = useToast();

  const handleSendCredentials = (orderId: string) => {
    toast({ 
      title: "Credenciais Enviadas", 
      description: `As credenciais do pedido ${orderId} foram enviadas para o cliente.` 
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, credentialsSent: true, status: 'completed' } : o));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-2">Pedidos</h1>
        <p className="text-muted-foreground">Monitore e entregue os produtos aos seus clientes.</p>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4 w-full max-w-md">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por e-mail ou ID do pedido..." 
                className="border-none bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Clock className="w-4 h-4" />
                Pendentes
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[120px]">ID Pedido</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold">{order.id}</TableCell>
                  <TableCell className="font-bold">{order.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{order.customerEmail}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-bold text-primary">R$ {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'outline'} className={order.status === 'completed' ? 'bg-green-500/20 text-green-500 border-none' : ''}>
                      {order.status === 'completed' ? 'Entregue' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver Detalhes">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!order.credentialsSent && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/5"
                          title="Enviar Credenciais"
                          onClick={() => handleSendCredentials(order.id)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                      {order.credentialsSent && (
                        <div className="h-8 w-8 flex items-center justify-center text-green-500">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
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
