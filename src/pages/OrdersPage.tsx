import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Clock, Scissors, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MOCK_ORDERS } from '@shared/mock-data';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@shared/types';
export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOrders = MOCK_ORDERS.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return "bg-amber-100 text-amber-700 border-amber-200";
      case 'In Progress': return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case 'Ready': return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 'Delivered': return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };
  const OrderGrid = ({ status }: { status: OrderStatus | 'All' }) => {
    const orders = status === 'All' ? filteredOrders : filteredOrders.filter(o => o.status === status);
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-white rounded-3xl border-2 border-dashed border-slate-100 mt-6">
          <Clock className="h-12 w-12 opacity-20 mb-4" />
          <p>No orders found in this category</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {orders.map((order) => {
          const isUrgent = order.dueDate - Date.now() < 86400000 * 3;
          return (
            <Card key={order.id} className="border-none shadow-soft hover:shadow-md transition-all overflow-hidden group">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold group-hover:text-indigo-600 transition-colors">
                      {order.customerName}
                    </CardTitle>
                    {isUrgent && order.status !== 'Ready' && (
                      <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", getStatusColor(order.status))}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Scissors className="h-3.5 w-3.5 text-slate-400" />
                        {item.type}
                      </span>
                      <span className="font-semibold text-slate-900">${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Due in {formatDistanceToNow(order.dueDate)}</span>
                  </div>
                  <div className="text-sm font-bold text-indigo-600">
                    ${order.total}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Tracking</h1>
            <p className="text-slate-500">Monitor production workflow and delivery schedules</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search orders..."
              className="pl-9 h-10 rounded-xl bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Tabs defaultValue="Pending" className="w-full">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-12 w-full max-w-2xl">
            <TabsTrigger value="Pending" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
              Pending
            </TabsTrigger>
            <TabsTrigger value="In Progress" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="Ready" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
              Ready
            </TabsTrigger>
            <TabsTrigger value="All" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
              All Orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Pending"><OrderGrid status="Pending" /></TabsContent>
          <TabsContent value="In Progress"><OrderGrid status="In Progress" /></TabsContent>
          <TabsContent value="Ready"><OrderGrid status="Ready" /></TabsContent>
          <TabsContent value="All"><OrderGrid status="All" /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}