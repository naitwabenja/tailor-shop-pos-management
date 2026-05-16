import React, { useMemo } from 'react';
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
  const currency = useAppStore(s => s.currency);
  const orders = useMemo(() => ordersData?.items || [], [ordersData]);
  const stats = useMemo(() => {
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
    const readyCount = orders.filter(o => o.status === 'Ready').length;
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    return [
      { label: 'Valuation', value: formatPrice(totalRevenue, currency), icon: TrendingUp, color: 'text-foreground', sub: 'Total Volume', count: 0 },
      { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-foreground', sub: 'In Queue', count: pendingCount },
      { label: 'On Bench', value: inProgressCount, icon: Scissors, color: 'text-foreground', sub: 'Under Hand', count: inProgressCount },
      { label: 'Ready', value: readyCount, icon: CheckCircle2, color: 'text-foreground', sub: 'Masterworks', count: readyCount },
    ];
  }, [orders, currency]);
  const pendingCount = stats.find(s => s.label === 'Pending')?.count || 0;
  const inProgressCount = stats.find(s => s.label === 'On Bench')?.count || 0;
  return (
    <div className="space-y-8 w-full">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-card px-8 py-12 text-foreground shadow-xl border-2 border-border">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight italic">Workshop Desk</h1>
            <p className="text-foreground/80 max-w-xl text-xl md:text-2xl leading-relaxed font-bold">
              Overseeing {pendingCount} commissions and {inProgressCount} masterpieces in the atelier.
            </p>
          </div>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:opacity-90 font-bold px-8 rounded-2xl shadow-xl h-16 text-xl shrink-0 transition-all active:scale-95">
            <Link to="/dashboard/pos">New Commission</Link>
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {stats.map((stat, i) => (
          <Card key={i} className="parchment min-h-[14rem] flex flex-col justify-between overflow-visible hover:scale-[1.02] transition-transform duration-300 border-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-6 px-6">
              <CardTitle className="text-[10px] font-bold text-foreground/50 uppercase tracking-[0.3em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-8 w-8", stat.color)} />
            </CardHeader>
            <CardContent className="pb-8 px-6">
              <div className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tighter leading-none truncate">
                {stat.value}
              </div>
              <p className="text-[10px] text-foreground/40 mt-4 font-bold uppercase tracking-[0.1em] italic">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="parchment overflow-hidden rounded-[1.5rem] border-2 border-border">
        <CardHeader className="border-b-2 border-border px-8 py-6 bg-foreground/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground italic">Commission Registry</h2>
              <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Latest Atelier Entries</p>
            </div>
            <Button variant="outline" size="sm" asChild className="font-bold text-foreground border-2 border-border hover:bg-primary hover:text-primary-foreground rounded-xl h-10 px-6 shadow-sm text-sm">
              <Link to="/dashboard/orders" className="flex items-center gap-2">
                Full Queue <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-foreground" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/10 space-y-4">
              <Sparkles className="h-20 w-20 opacity-10" />
              <p className="text-xl font-serif italic font-bold">Workshop gallery is currently silent.</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-border">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 hover:bg-foreground/5 transition-all group cursor-default">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-serif font-bold shadow-lg group-hover:scale-105 transition-transform">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xl tracking-tight leading-none mb-1">{order.customerName}</h4>
                      <div className="flex items-center gap-4 text-xs text-foreground/50 font-bold">
                        <span className="uppercase tracking-wider text-foreground">{order.items[0]?.garmentName}</span>
                        <span className="opacity-20">|</span>
                        <span className="italic">Due {format(order.dueDate, 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <Badge className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] border-none shadow-sm",
                      order.status === 'Ready' && "bg-primary text-primary-foreground",
                      order.status === 'Pending' && "bg-card text-foreground border-2 border-border",
                      order.status === 'In Progress' && "bg-secondary text-secondary-foreground",
                      order.status === 'Delivered' && "bg-foreground/10 text-foreground"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[140px]">
                      <div className="font-serif font-bold text-foreground text-2xl italic">{formatPrice(order.total, currency)}</div>
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