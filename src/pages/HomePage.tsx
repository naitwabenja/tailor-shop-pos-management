import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Scissors,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { useOrders } from '@/hooks/use-api';
import { useAppStore } from '@/store/use-app-store';
export function HomePage() {
  const { data: ordersData, isLoading } = useOrders();
  const currency = useAppStore((s) => s.currency);
  const orders = ordersData?.items || [];
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-brand-brown to-brand-green px-12 py-20 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="space-y-6">
            <h1 className="text-6xl font-serif font-bold tracking-tight">Workshop Desk</h1>
            <p className="text-brand-beige/80 max-w-2xl text-2xl leading-relaxed">
              Managing {pendingCount} commissions and {inProgressCount} active masterpieces today.
            </p>
          </div>
          <Button asChild size="lg" className="bg-brand-beige text-brand-brown hover:bg-white font-bold px-12 rounded-2xl shadow-2xl border-none h-16 text-xl">
            <Link to="/dashboard/pos">New Commission</Link>
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Valuation', value: formatPrice(totalRevenue, currency), icon: TrendingUp, color: 'text-brand-green', sub: 'Active work volume' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-brand-brown', sub: 'Awaiting first stitch' },
          { label: 'On Bench', value: inProgressCount, icon: Scissors, color: 'text-brand-moss', sub: 'In production' },
          { label: 'Ready', value: readyCount, icon: CheckCircle2, color: 'text-emerald-600', sub: 'Final fitting' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-soft bg-card/50 backdrop-blur-sm h-64 flex flex-col justify-between p-2">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </CardHeader>
            <CardContent className="pb-8">
              <div className="text-6xl font-serif font-bold text-foreground tracking-tighter">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-4 font-medium italic opacity-60">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none shadow-soft overflow-hidden rounded-[2.5rem]">
        <CardHeader className="border-b border-border/50 bg-card/30 px-10 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold">Commission Registry</h2>
              <p className="text-muted-foreground font-medium mt-1">Latest atelier entries</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="font-bold text-brand-brown hover:text-brand-green hover:bg-brand-brown/5 rounded-xl h-12 px-6">
              <Link to="/dashboard/orders" className="flex items-center gap-2">
                Queue <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 className="animate-spin h-12 w-12 text-brand-brown" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground space-y-8">
              <Sparkles className="h-20 w-20 opacity-10" />
              <p className="text-2xl font-serif italic">Workshop gallery empty.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-10 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-brown text-white text-2xl font-serif font-bold shadow-md group-hover:scale-105 transition-transform">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-2xl tracking-tight">{order.customerName}</h4>
                      <div className="flex items-center gap-4 text-base text-muted-foreground mt-1">
                        <span className="font-bold text-brand-green">{order.items[0]?.garmentName}</span>
                        <span className="opacity-30">•</span>
                        <span>Due {format(order.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <Badge className={cn(
                      "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border-none shadow-sm",
                      order.status === 'Ready' && "bg-brand-green text-white",
                      order.status === 'Pending' && "bg-brand-tan text-brand-brown",
                      order.status === 'In Progress' && "bg-brand-brown text-white",
                      order.status === 'Delivered' && "bg-muted text-muted-foreground"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[140px]">
                      <div className="font-serif font-bold text-foreground text-3xl">{formatPrice(order.total, currency)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}