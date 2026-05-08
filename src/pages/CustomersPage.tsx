import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
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
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-brown tracking-tight italic">Artisan Registry</h1>
            <p className="text-brand-brown/60 font-medium">Managing relationships and metrics for LEAfrique's esteemed clients</p>
          </div>
          <Button
            className="bg-brand-brown hover:bg-brand-green text-white font-bold gap-2 shadow-xl shadow-brand-brown/20 rounded-2xl px-8 h-14 text-lg transition-all active:scale-95"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <UserPlus className="h-6 w-6" /> Register Client
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-brand-brown/30" />
            <Input
              placeholder="Search by name, phone or identification..."
              className="pl-12 h-14 rounded-2xl bg-white/60 backdrop-blur-sm border-brand-brown/10 focus-visible:ring-brand-brown shadow-soft"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-brand-brown/10 bg-white/60 hover:bg-brand-brown/5">
            <Filter className="h-6 w-6 text-brand-brown/60" />
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-soft h-56 bg-white/40">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-none shadow-soft hover:shadow-xl transition-all overflow-hidden group bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6 p-8">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-tan/30 text-brand-brown text-2xl font-serif font-bold group-hover:bg-brand-brown group-hover:text-white transition-all">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-brand-brown group-hover:underline decoration-brand-brown/20 transition-all">{customer.name}</CardTitle>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="secondary" className="bg-brand-tan/10 text-brand-brown/60 font-bold border-none text-[9px] uppercase tracking-widest">Client</Badge>
                        <span className="text-xs text-brand-brown/40 font-bold flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" /> {customerOrderCounts[customer.id] || 0} Commissions
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-brand-brown/30 hover:bg-brand-brown/5 rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-brand-brown/10">
                      <DropdownMenuItem className="font-bold text-brand-brown">Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem className="font-bold text-brand-brown">View Commissions</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 font-bold">Archive Profile</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-5 px-8 pb-8 pt-0">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-brand-brown/70">
                      <Phone className="h-4 w-4 text-brand-brown/20" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-brand-brown/70">
                      <Mail className="h-4 w-4 text-brand-brown/20" />
                      {customer.email || "No digital address"}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-brown/30">
                      <Calendar className="h-3.5 w-3.5" />
                      Registry Date: {customer.createdAt ? format(customer.createdAt, 'MMM yyyy') : 'Recent'}
                    </div>
                  </div>
                  <div className="pt-6 flex gap-3 border-t border-brand-brown/5">
                    <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl gap-2 border-brand-brown/10 text-brand-brown font-bold hover:bg-brand-brown/5">
                      <Link to="/dashboard/measurements">
                        <Ruler className="h-4 w-4" /> Metrics
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl border-brand-brown/10 text-brand-brown font-bold hover:bg-brand-brown/5">History</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-brand-brown/20 space-y-6">
            <Users className="h-24 w-24 opacity-10" />
            <p className="text-2xl font-serif italic text-brand-brown/40">No artisan profiles found in the current registry</p>
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