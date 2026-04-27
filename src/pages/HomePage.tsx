import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { MOCK_ORDERS } from '@shared/mock-data';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const pendingCount = MOCK_ORDERS.filter(o => o.status === 'Pending').length;
  const inProgressCount = MOCK_ORDERS.filter(o => o.status === 'In Progress').length;
  const todayRevenue = MOCK_ORDERS.reduce((acc, o) => acc + o.total, 0);
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good morning, Master Tailor</h1>
              <p className="mt-2 text-indigo-100 max-w-lg">
                You have {pendingCount} new orders waiting and {inProgressCount} garments currently on the bench.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-xl">
                <Link to="/pos">New Order</Link>
              </Button>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Today's Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">${todayRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">+12.5% from yesterday</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{pendingCount}</div>
              <p className="text-xs text-slate-500 mt-1">Require measurements</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">In Progress</CardTitle>
              <Scissors className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{inProgressCount}</div>
              <p className="text-xs text-slate-500 mt-1">Under construction</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ready for Pickup</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {MOCK_ORDERS.filter(o => o.status === 'Ready').length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Completed orders</p>
            </CardContent>
          </Card>
        </div>
        {/* Recent Urgent Orders */}
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Urgent Orders</CardTitle>
                <CardDescription>Orders approaching their due date</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/orders" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{order.customerName}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{order.items[0]?.type}</span>
                        <span>•</span>
                        <span>Due {format(order.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      order.status === 'Ready' && "bg-emerald-100 text-emerald-700",
                      order.status === 'Pending' && "bg-amber-100 text-amber-700",
                      order.status === 'In Progress' && "bg-indigo-100 text-indigo-700"
                    )}>
                      {order.status}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">${order.total}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}