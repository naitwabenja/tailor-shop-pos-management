import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Filter,
  Users,
  Ruler,
  ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomers, useOrders } from '@/hooks/use-api';
import { CustomerCreateDialog } from '@/components/customers/CustomerCreateDialog';
export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data, isLoading } = useCustomers();
  const { data: ordersData } = useOrders();
  const customerOrderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ordersData?.items.forEach(order => {
      counts[order.customerId] = (counts[order.customerId] || 0) + 1;
    });
    return counts;
  }, [ordersData]);
  const filteredCustomers = data?.items.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  ) || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-brown tracking-tight italic">Artisan Registry</h1>
            <p className="text-xs text-brand-brown/60 font-bold">Managing relationships and metrics</p>
          </div>
          <Button
            size="sm"
            className="bg-brand-brown hover:bg-brand-green text-white font-bold gap-2 shadow-lg shadow-brand-brown/20 rounded-xl px-6 h-11 text-base transition-all active:scale-95"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <UserPlus className="h-5 w-5" /> Register Client
          </Button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-brand-brown/30" />
            <Input
              placeholder="Search registry..."
              className="pl-10 h-11 rounded-xl bg-white/60 backdrop-blur-sm border-brand-brown/10 focus-visible:ring-brand-brown text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-brand-brown/10 bg-white/60">
            <Filter className="h-5 w-5 text-brand-brown/60" />
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-sm h-48 bg-white/40">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tan/30 text-brand-brown text-xl font-serif font-bold group-hover:bg-brand-brown group-hover:text-white transition-all">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-brand-brown group-hover:underline decoration-brand-brown/20 leading-tight">{customer.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-brand-tan/10 text-brand-brown/60 font-bold border-none text-[8px] uppercase tracking-wider px-1.5 py-0">Client</Badge>
                        <span className="text-[10px] text-brand-brown/40 font-bold flex items-center gap-1">
                          <ShoppingBag className="h-2.5 w-2.5" /> {customerOrderCounts[customer.id] || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-brand-brown/30 hover:bg-brand-brown/5 rounded-full h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-brand-brown/10">
                      <DropdownMenuItem className="font-bold text-brand-brown text-xs">Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem className="font-bold text-brand-brown text-xs">View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 font-bold text-xs">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6 pt-0">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-brown/70">
                      <Phone className="h-3.5 w-3.5 text-brand-brown/20" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-brown/30">
                      <Calendar className="h-3 w-3" />
                      Joined: {customer.createdAt ? format(customer.createdAt, 'MMM yyyy') : 'Recent'}
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2 border-t border-brand-brown/5">
                    <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg gap-1.5 h-8 border-brand-brown/10 text-brand-brown font-bold text-[10px] uppercase">
                      <Link to="/dashboard/measurements">
                        <Ruler className="h-3 w-3" /> Metrics
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg h-8 border-brand-brown/10 text-brand-brown font-bold text-[10px] uppercase">History</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-brand-brown/20 space-y-4">
            <Users className="h-16 w-16 opacity-10" />
            <p className="text-lg font-serif italic text-brand-brown/40">No profiles found</p>
          </div>
        )}
      </div>
      <CustomerCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}