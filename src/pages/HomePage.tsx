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
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-black px-10 py-16 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-serif font-black tracking-tight italic">Workshop Desk</h1>
            <p className="text-white/60 max-w-2xl text-xl leading-relaxed font-medium">
              Managing {pendingCount} commissions and {inProgressCount} active masterpieces.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-black px-10 rounded-2xl shadow-xl h-14 text-lg shrink-0">
            <Link to="/dashboard/pos">New Commission</Link>
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Valuation', value: formatPrice(totalRevenue, currency), icon: TrendingUp, color: 'text-emerald-500', sub: 'Volume' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500', sub: 'Awaiting' },
          { label: 'On Bench', value: inProgressCount, icon: Scissors, color: 'text-blue-500', sub: 'Active' },
          { label: 'Ready', value: readyCount, icon: CheckCircle2, color: 'text-green-500', sub: 'Complete' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-soft bg-white/80 backdrop-blur-sm h-52 md:h-60 flex flex-col justify-between overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-6 px-6">
              <CardTitle className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </CardHeader>
            <CardContent className="pb-8 px-6">
              <div className="text-4xl md:text-5xl font-serif font-black text-black tracking-tighter truncate">{stat.value}</div>
              <p className="text-xs text-black/40 mt-3 font-black uppercase tracking-widest italic opacity-60">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none shadow-soft overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-sm">
        <CardHeader className="border-b border-black/5 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-black text-black">Commission Registry</h2>
              <p className="text-black/40 text-xs font-black uppercase tracking-widest mt-1">Latest atelier entries</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="font-black text-black hover:bg-black/5 rounded-xl h-10 px-4">
              <Link to="/dashboard/orders" className="flex items-center gap-2">
                Queue <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-black" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-black/20 space-y-4">
              <Sparkles className="h-16 w-16 opacity-10" />
              <p className="text-xl font-serif italic">Workshop gallery empty.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-8 hover:bg-black/5 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white text-xl font-serif font-black shadow-md group-hover:scale-105 transition-transform">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-black text-xl tracking-tight">{order.customerName}</h4>
                      <div className="flex items-center gap-3 text-sm text-black/50 mt-1 font-bold">
                        <span className="text-black">{order.items[0]?.garmentName}</span>
                        <span className="opacity-20">•</span>
                        <span>Due {format(order.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <Badge className={cn(
                      "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-sm",
                      order.status === 'Ready' && "bg-green-600 text-white",
                      order.status === 'Pending' && "bg-amber-100 text-amber-900",
                      order.status === 'In Progress' && "bg-black text-white",
                      order.status === 'Delivered' && "bg-slate-200 text-slate-800"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[120px]">
                      <div className="font-serif font-black text-black text-2xl italic">{formatPrice(order.total, currency)}</div>
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