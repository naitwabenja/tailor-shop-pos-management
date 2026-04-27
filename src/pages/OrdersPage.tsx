import React, { useState } from 'react';
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
import { Search, Clock, Scissors, CheckCircle2, AlertTriangle, MoreVertical, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn, formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@shared/types';
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-app-store';
export default function OrdersPage() {
  const currency = useAppStore(s => s.currency);
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
      case 'Pending': return "bg-brand-tan/20 text-brand-brown border-brand-tan/40";
      case 'In Progress': return "bg-brand-brown text-white border-none";
      case 'Ready': return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case 'Delivered': return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };
  const OrderGrid = ({ status }: { status: OrderStatus | 'All' }) => {
    const orders = status === 'All' ? filteredOrders : filteredOrders.filter(o => o.status === status);
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map(i => <Card key={i} className="h-40 animate-pulse bg-brand-brown/5 rounded-xl" />)}
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-brand-brown/10 mt-6"
        >
          <Sparkles className="h-10 w-10 opacity-10 mb-2 text-brand-brown" />
          <h3 className="text-lg font-serif font-bold text-brand-brown mb-1">Queue Empty</h3>
          <p className="text-xs text-brand-brown/50 font-bold italic">No active production commissions.</p>
        </motion.div>
      );
    }
    return (
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => {
            const isUrgent = order.dueDate - Date.now() < 86400000 * 3;
            return (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group h-full flex flex-col bg-white/60 backdrop-blur-sm">
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <CardTitle className="text-base font-bold group-hover:text-brand-brown transition-colors truncate max-w-[120px]">
                          {order.customerName}
                        </CardTitle>
                        {isUrgent && order.status !== 'Ready' && order.status !== 'Delivered' && (
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[9px] text-brand-brown/40 font-bold uppercase tracking-wider">ID: {order.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className={cn("px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tight", getStatusColor(order.status))}>
                        {order.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-brand-brown/5">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-brand-brown/10">
                          {(['Pending', 'In Progress', 'Ready', 'Delivered'] as OrderStatus[]).map(s => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => updateStatus.mutate({ id: order.id, status: s })}
                              disabled={updateStatus.isPending}
                              className={cn("text-xs font-bold", order.status === s && "bg-brand-brown/5 text-brand-brown")}
                            >
                              Move to {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3 flex-1">
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-brand-brown/5">
                          <span className="text-brand-brown flex items-center gap-1.5 font-bold">
                            <Scissors className="h-3 w-3 opacity-40" />
                            {item.garmentName}
                          </span>
                          <span className="font-bold text-brand-brown">{formatPrice(item.price, currency)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-brand-brown/10 flex items-center justify-between mt-auto">
                      <div className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight", isUrgent ? "text-red-500" : "text-brand-brown/40")}>
                        <Clock className="h-3 w-3" />
                        <span>Due {formatDistanceToNow(order.dueDate)}</span>
                      </div>
                      <div className="text-base font-serif font-bold text-brand-brown italic">
                        {formatPrice(order.total, currency)}
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-brown tracking-tight">Production Queue</h1>
          <p className="text-xs text-brand-brown/50 font-bold">Tracking workshop creations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filterUrgent ? "destructive" : "outline"}
            size="sm"
            className="rounded-lg gap-1.5 font-bold h-9 px-3 border-brand-brown/10 text-xs"
            onClick={() => setFilterUrgent(!filterUrgent)}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Urgent
          </Button>
          <div className="relative w-full md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-brand-brown/30" />
            <Input
              placeholder="Find artisan work..."
              className="pl-9 h-9 rounded-lg bg-white/50 border-brand-brown/10 focus-visible:ring-brand-brown text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Tabs defaultValue="Pending" className="w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList className="bg-brand-brown/5 p-1 rounded-xl h-11 w-full max-w-xl border border-brand-brown/10">
            <TabsTrigger value="Pending" className="flex-1 rounded-lg data-[state=active]:bg-brand-brown data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value="In Progress" className="flex-1 rounded-lg data-[state=active]:bg-brand-brown data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs">
              On Bench
            </TabsTrigger>
            <TabsTrigger value="Ready" className="flex-1 rounded-lg data-[state=active]:bg-brand-brown data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs">
              Ready
            </TabsTrigger>
            <TabsTrigger value="All" className="flex-1 rounded-lg data-[state=active]:bg-brand-brown data-[state=active]:text-white data-[state=active]:shadow-md font-bold text-xs">
              Archives
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1 bg-white/50 p-1 rounded-lg border border-brand-brown/10 backdrop-blur-sm">
             <Button
               variant={sortBy === 'due' ? 'secondary' : 'ghost'}
               size="sm"
               className="rounded h-7 text-[9px] uppercase tracking-wider font-bold px-2"
               onClick={() => setSortBy('due')}
             >Due</Button>
             <Button
               variant={sortBy === 'created' ? 'secondary' : 'ghost'}
               size="sm"
               className="rounded h-7 text-[9px] uppercase tracking-wider font-bold px-2"
               onClick={() => setSortBy('created')}
             >New</Button>
          </div>
        </div>
        <TabsContent value="Pending"><OrderGrid status="Pending" /></TabsContent>
        <TabsContent value="In Progress"><OrderGrid status="In Progress" /></TabsContent>
        <TabsContent value="Ready"><OrderGrid status="Ready" /></TabsContent>
        <TabsContent value="All"><OrderGrid status="All" /></TabsContent>
      </Tabs>
    </div>
  );
}