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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-forest to-brand-moss px-10 py-20 text-brand-wheat shadow-2xl leather-edge">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="space-y-6">
            <h1 className="text-6xl font-serif font-black tracking-tight italic">Workshop Desk</h1>
            <p className="text-brand-wheat/90 max-w-2xl text-2xl leading-relaxed font-black">
              Overseeing {pendingCount} commissions and {inProgressCount} active masterpieces in the atelier.
            </p>
          </div>
          <Button asChild size="lg" className="bg-brand-wheat text-brand-forest hover:bg-brand-saddle hover:text-brand-wheat font-black px-12 rounded-[2rem] shadow-2xl h-20 text-xl shrink-0 transition-all active:scale-95">
            <Link to="/dashboard/pos">New Commission</Link>
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-wheat/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-soil/20 blur-3xl" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Valuation', value: formatPrice(totalRevenue, currency), icon: TrendingUp, color: 'text-brand-forest', sub: 'Total Volume' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-brand-wood', sub: 'In Queue' },
          { label: 'On Bench', value: inProgressCount, icon: Scissors, color: 'text-brand-saddle', sub: 'Under Hand' },
          { label: 'Ready', value: readyCount, icon: CheckCircle2, color: 'text-brand-forest', sub: 'Masterworks' },
        ].map((stat, i) => (
          <Card key={i} className="parchment h-60 flex flex-col justify-between overflow-hidden hover:scale-[1.02] transition-transform duration-300 border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-8 px-8">
              <CardTitle className="text-[11px] font-black text-brand-soil/50 uppercase tracking-[0.4em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-8 w-8", stat.color)} />
            </CardHeader>
            <CardContent className="pb-10 px-8">
              <div className="text-5xl font-serif font-black text-brand-soil tracking-tighter truncate leading-tight">
                {stat.value}
              </div>
              <p className="text-[10px] text-brand-saddle/60 mt-4 font-black uppercase tracking-[0.2em] italic">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="parchment overflow-hidden rounded-[2.5rem] leather-edge border-2">
        <CardHeader className="border-b-2 border-brand-tan/30 px-10 py-8 bg-brand-tan/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-black text-brand-soil">Commission Registry</h2>
              <p className="text-brand-saddle/60 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Latest Atelier Entries</p>
            </div>
            <Button variant="outline" size="lg" asChild className="font-black text-brand-soil border-2 border-brand-tan/30 hover:bg-brand-tan/20 rounded-2xl h-14 px-8 shadow-sm">
              <Link to="/dashboard/orders" className="flex items-center gap-3">
                Production Queue <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-32"><Loader2 className="animate-spin h-12 w-12 text-brand-saddle" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-brand-soil/20 space-y-6">
              <Sparkles className="h-24 w-24 opacity-10 text-brand-saddle" />
              <p className="text-2xl font-serif italic text-brand-soil/40 font-bold">Workshop gallery is currently silent.</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-brand-tan/20">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-10 hover:bg-brand-tan/10 transition-all group cursor-default">
                  <div className="flex items-center gap-8">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-soil text-brand-wheat text-2xl font-serif font-black shadow-lg group-hover:scale-110 transition-transform">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-brand-soil text-2xl tracking-tight leading-none mb-2">{order.customerName}</h4>
                      <div className="flex items-center gap-4 text-sm text-brand-soil/60 font-black">
                        <span className="text-brand-saddle uppercase tracking-widest">{order.items[0]?.garmentName}</span>
                        <span className="opacity-20 text-brand-tan font-normal">|</span>
                        <span className="italic">Due {format(order.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <Badge className={cn(
                      "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-none shadow-md",
                      order.status === 'Ready' && "bg-brand-forest text-brand-wheat",
                      order.status === 'Pending' && "bg-brand-tan text-brand-soil",
                      order.status === 'In Progress' && "bg-brand-saddle text-brand-wheat",
                      order.status === 'Delivered' && "bg-brand-soil text-brand-wheat"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[150px]">
                      <div className="font-serif font-black text-brand-soil text-3xl italic">{formatPrice(order.total, currency)}</div>
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