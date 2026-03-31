
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  PackageCheck, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const totalRevenue = INITIAL_ORDERS.reduce((acc, order) => acc + order.total, 0);
  const totalSales = INITIAL_ORDERS.length;
  const activeProducts = INITIAL_PRODUCTS.length;
  const lowStock = INITIAL_PRODUCTS.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu império de streaming.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Receita Total", value: `R$ ${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-500", change: "+12%", up: true },
          { label: "Vendas Totais", value: totalSales, icon: PackageCheck, color: "text-blue-500", change: "+5%", up: true },
          { label: "Produtos Ativos", value: activeProducts, icon: Users, color: "text-primary", change: "0%", up: true },
          { label: "Estoque Baixo", value: lowStock, icon: AlertTriangle, color: "text-yellow-500", change: "-2", up: false },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1 text-xs font-medium">
                {stat.up ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                <span className={stat.up ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="text-muted-foreground ml-1">desde ontem</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="font-headline">Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {INITIAL_ORDERS.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold">{order.productName}</span>
                    <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">R$ {order.total.toFixed(2)}</span>
                    <Badge variant={order.status === 'completed' ? 'default' : 'outline'} className={order.status === 'completed' ? 'bg-green-500/20 text-green-500 border-none' : ''}>
                      {order.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="font-headline">Status do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {INITIAL_PRODUCTS.map((product) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{product.name}</span>
                    <span className={product.stock < 10 ? "text-red-500 font-bold" : "text-muted-foreground"}>
                      {product.stock} em estoque
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", product.stock < 10 ? "bg-red-500" : "bg-primary")} 
                      style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
