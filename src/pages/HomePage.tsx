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
    <div className="space-y-12 w-full">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-black px-10 py-20 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tight italic">Workshop Desk</h1>
            <p className="text-white/80 max-w-2xl text-2xl md:text-3xl leading-relaxed font-bold">
              Overseeing {pendingCount} commissions and {inProgressCount} masterpieces in the atelier.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-black hover:bg-brand-wheat hover:text-black font-black px-12 rounded-[2rem] shadow-2xl h-24 text-2xl shrink-0 transition-all active:scale-95">
            <Link to="/dashboard/pos">New Commission</Link>
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {[
          { label: 'Valuation', value: formatPrice(totalRevenue, currency), icon: TrendingUp, color: 'text-black', sub: 'Total Volume' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-black', sub: 'In Queue' },
          { label: 'On Bench', value: inProgressCount, icon: Scissors, color: 'text-black', sub: 'Under Hand' },
          { label: 'Ready', value: readyCount, icon: CheckCircle2, color: 'text-black', sub: 'Masterworks' },
        ].map((stat, i) => (
          <Card key={i} className="parchment min-h-[18rem] md:min-h-[20rem] flex flex-col justify-between overflow-visible hover:scale-[1.02] transition-transform duration-300 border-2 border-black/20">
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-10 px-10">
              <CardTitle className="text-xs font-black text-black/50 uppercase tracking-[0.4em]">{stat.label}</CardTitle>
              <stat.icon className={cn("h-10 w-10", stat.color)} />
            </CardHeader>
            <CardContent className="pb-12 px-10">
              <div className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-black tracking-tighter leading-none whitespace-nowrap overflow-visible">
                {stat.value}
              </div>
              <p className="text-xs text-black/40 mt-6 font-black uppercase tracking-[0.2em] italic">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="parchment overflow-hidden rounded-[2.5rem] border-2 border-black/20">
        <CardHeader className="border-b-2 border-black/10 px-10 py-10 bg-black/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-serif font-black text-black italic">Commission Registry</h2>
              <p className="text-black/40 text-xs font-black uppercase tracking-[0.3em] mt-2">Latest Atelier Entries</p>
            </div>
            <Button variant="outline" size="lg" asChild className="font-black text-black border-2 border-black/20 hover:bg-black hover:text-white rounded-2xl h-16 px-10 shadow-sm text-lg">
              <Link to="/dashboard/orders" className="flex items-center gap-3">
                Full Queue <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-40"><Loader2 className="animate-spin h-16 w-16 text-black" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-black/10 space-y-8">
              <Sparkles className="h-32 w-32 opacity-10" />
              <p className="text-3xl font-serif italic font-bold">Workshop gallery is currently silent.</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black/5">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-12 hover:bg-black/5 transition-all group cursor-default">
                  <div className="flex items-center gap-10">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-black text-white text-3xl font-serif font-black shadow-xl group-hover:scale-110 transition-transform">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-black text-3xl tracking-tight leading-none mb-3">{order.customerName}</h4>
                      <div className="flex items-center gap-6 text-sm text-black/50 font-black">
                        <span className="uppercase tracking-widest text-black">{order.items[0]?.garmentName}</span>
                        <span className="opacity-20">|</span>
                        <span className="italic">Due {format(order.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-16">
                    <Badge className={cn(
                      "px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] border-none shadow-md",
                      order.status === 'Ready' && "bg-black text-white",
                      order.status === 'Pending' && "bg-white text-black border-2 border-black/10",
                      order.status === 'In Progress' && "bg-black text-white",
                      order.status === 'Delivered' && "bg-black/10 text-black"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[200px]">
                      <div className="font-serif font-black text-black text-4xl italic">{formatPrice(order.total, currency)}</div>
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