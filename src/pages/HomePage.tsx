import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-brown to-brand-green px-10 py-16 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-serif font-bold tracking-tight">Atelier Overview</h1>
            <p className="text-brand-beige/80 max-w-xl text-xl leading-relaxed">
              Your craftsmanship gallery. Currently managing {pendingCount} new bespoke commissions and {inProgressCount} garments under tailoring.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-brand-beige text-brand-brown hover:bg-white font-bold px-10 rounded-2xl shadow-2xl border-none h-14 text-lg">
              <Link to="/dashboard/pos">New Commission</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 left-40 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Value', value: formatPrice(totalRevenue, currency), icon: TrendingUp, color: 'text-brand-green', sub: 'Active revenue pool' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-brand-brown', sub: 'Awaiting first stitch' },
          { label: 'On Bench', value: inProgressCount, icon: Scissors, color: 'text-brand-moss', sub: 'In artistic production' },
          { label: 'Ready', value: readyCount, icon: CheckCircle2, color: 'text-emerald-600', sub: 'Awaiting client fitting' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2 font-medium italic opacity-70">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none shadow-soft overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-border/50 bg-card/30 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-serif font-bold">Recent Commissions</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">The latest artisan entries into the LEAfrique registry</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="font-bold text-brand-brown hover:text-brand-green hover:bg-brand-brown/5 rounded-xl">
              <Link to="/dashboard/orders" className="flex items-center gap-2">
                Queue Manager <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-brand-brown" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-6">
              <Sparkles className="h-16 w-16 opacity-10" />
              <p className="text-xl font-serif italic">Your workshop gallery is empty. Begin a new masterpiece.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-7 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-brown text-white text-xl font-serif font-bold shadow-md group-hover:scale-110 transition-transform">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xl tracking-tight">{order.customerName}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="font-bold text-brand-green">{order.items[0]?.garmentName}</span>
                        <span className="opacity-30">•</span>
                        <span>Due {format(order.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <Badge className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-none shadow-sm",
                      order.status === 'Ready' && "bg-brand-green text-white",
                      order.status === 'Pending' && "bg-brand-tan text-brand-brown",
                      order.status === 'In Progress' && "bg-brand-brown text-white",
                      order.status === 'Delivered' && "bg-muted text-muted-foreground"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[120px]">
                      <div className="font-serif font-bold text-foreground text-2xl">{formatPrice(order.total, currency)}</div>
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