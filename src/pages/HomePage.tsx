import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Scissors,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOrders } from '@/hooks/use-api';
export function HomePage() {
  const { data: ordersData, isLoading } = useOrders();
  const orders = ordersData?.items || [];
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Atelier Dashboard</h1>
            <p className="mt-3 text-indigo-100 max-w-lg text-lg">
              Manage your craftsmanship. You have {pendingCount} new assignments and {inProgressCount} garments being tailored.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 rounded-2xl shadow-xl border-none">
              <Link to="/pos">New Commission</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Across all active orders</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{pendingCount}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting construction</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">On Bench</CardTitle>
            <Scissors className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{inProgressCount}</div>
            <p className="text-xs text-slate-500 mt-1">Under craftsman's needle</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{readyCount}</div>
            <p className="text-xs text-slate-500 mt-1">Ready for fitting</p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-none shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Recent Commissions</CardTitle>
              <CardDescription>Latest orders entered into the system</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="font-bold text-indigo-600 hover:text-indigo-700">
              <Link to="/orders" className="flex items-center gap-1">
                Queue Manager <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No recent activity found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{order.customerName}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium text-indigo-500">{order.items[0]?.garmentName}</span>
                        <span>•</span>
                        <span>Due {format(order.dueDate, 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border-none",
                      order.status === 'Ready' && "bg-emerald-100 text-emerald-700",
                      order.status === 'Pending' && "bg-amber-100 text-amber-700",
                      order.status === 'In Progress' && "bg-indigo-100 text-indigo-700",
                      order.status === 'Delivered' && "bg-slate-100 text-slate-700"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right min-w-[80px]">
                      <div className="font-extrabold text-slate-900 text-lg">${order.total.toFixed(0)}</div>
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