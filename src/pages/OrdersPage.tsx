import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Clock, Scissors, CheckCircle2, AlertTriangle, MoreVertical, LayoutGrid, SortAsc, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@shared/types';
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'due' | 'created'>('due');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const { data, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const filteredOrders = React.useMemo(() => {
    let orders = data?.items.filter(o =>
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    if (filterUrgent) {
      orders = orders.filter(o => (o.dueDate - Date.now() < 86400000 * 3) && o.status !== 'Ready' && o.status !== 'Delivered');
    }
    return orders.sort((a, b) => sortBy === 'due' ? a.dueDate - b.dueDate : b.createdAt - a.createdAt);
  }, [data, searchTerm, filterUrgent, sortBy]);
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
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-slate-50 rounded-2xl" />)}
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-white rounded-3xl border-2 border-dashed border-slate-100 mt-6"
        >
          <Sparkles className="h-16 w-16 opacity-10 mb-4 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">Queue Clear</h3>
          <p className="text-slate-500">No active production commissions found for this category.</p>
        </motion.div>
      );
    }
    return (
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        <AnimatePresence mode="popLayout">
          {orders.map((order) => {
            const isUrgent = order.dueDate - Date.now() < 86400000 * 3;
            return (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-none shadow-soft hover:shadow-md transition-all overflow-hidden group h-full flex flex-col">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold group-hover:text-indigo-600 transition-colors">
                          {order.customerName}
                        </CardTitle>
                        {isUrgent && order.status !== 'Ready' && order.status !== 'Delivered' && (
                          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Urgent" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Ref: #{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", getStatusColor(order.status))}>
                        {order.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          {(['Pending', 'In Progress', 'Ready', 'Delivered'] as OrderStatus[]).map(s => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => updateStatus.mutate({ id: order.id, status: s })}
                              disabled={updateStatus.isPending}
                              className={cn(order.status === s && "bg-indigo-50 text-indigo-600 font-bold")}
                            >
                              Mark as {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50">
                          <span className="text-slate-600 flex items-center gap-2">
                            <Scissors className="h-3.5 w-3.5 text-slate-400" />
                            {item.type}
                          </span>
                          <span className="font-semibold text-slate-900">${item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className={cn("flex items-center gap-2 text-xs font-medium", isUrgent ? "text-red-500" : "text-slate-400")}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>Due {formatDistanceToNow(order.dueDate)}</span>
                      </div>
                      <div className="text-sm font-bold text-indigo-600">
                        ${order.total.toFixed(0)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    );
  };
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Production Queue</h1>
            <p className="text-slate-500">Track bespoke garments from bench to client delivery</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={filterUrgent ? "destructive" : "outline"} 
              size="sm" 
              className="rounded-xl gap-2 font-bold h-10 px-4"
              onClick={() => setFilterUrgent(!filterUrgent)}
            >
              <AlertTriangle className="h-4 w-4" /> Urgent
            </Button>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Find commission..."
                className="pl-9 h-10 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Tabs defaultValue="Pending" className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TabsList className="bg-slate-100 p-1 rounded-xl h-12 w-full max-w-2xl border border-slate-200/50">
              <TabsTrigger value="Pending" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
                Pending
              </TabsTrigger>
              <TabsTrigger value="In Progress" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
                On Bench
              </TabsTrigger>
              <TabsTrigger value="Ready" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
                Ready
              </TabsTrigger>
              <TabsTrigger value="All" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
                Master List
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
               <Button 
                 variant={sortBy === 'due' ? 'secondary' : 'ghost'} 
                 size="sm" 
                 className="rounded-lg h-8 text-[10px] uppercase tracking-wider font-bold"
                 onClick={() => setSortBy('due')}
               >Due</Button>
               <Button 
                 variant={sortBy === 'created' ? 'secondary' : 'ghost'} 
                 size="sm" 
                 className="rounded-lg h-8 text-[10px] uppercase tracking-wider font-bold"
                 onClick={() => setSortBy('created')}
               >Recent</Button>
            </div>
          </div>
          <TabsContent value="Pending"><OrderGrid status="Pending" /></TabsContent>
          <TabsContent value="In Progress"><OrderGrid status="In Progress" /></TabsContent>
          <TabsContent value="Ready"><OrderGrid status="Ready" /></TabsContent>
          <TabsContent value="All"><OrderGrid status="All" /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}