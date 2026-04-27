import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
            <p className="text-slate-500">View and manage profiles for all tailorshop clients</p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-lg shadow-indigo-100 rounded-xl px-6 h-12"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <UserPlus className="h-5 w-5" /> Add New Client
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by name, email or phone number..."
              className="pl-10 h-12 rounded-xl bg-white shadow-sm border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200 bg-white">
            <Filter className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-soft h-48">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-none shadow-soft hover:shadow-md transition-shadow overflow-hidden group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-indigo-600 transition-colors">{customer.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium border-none text-[10px] uppercase tracking-wider">Client</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" /> {customerOrderCounts[customer.id] || 0} Orders
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-100 rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem>Order History</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Archive Client</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {customer.email || "No email provided"}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Last seen {customer.lastVisitAt ? format(customer.lastVisitAt, 'MMM d, yyyy') : 'Never'}
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2 border-t border-slate-100">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-2 border-slate-200">
                          <Ruler className="h-3.5 w-3.5" /> Measurements
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-md">
                        <SheetHeader className="mb-6">
                          <SheetTitle className="text-2xl flex items-center gap-3">
                            <Ruler className="h-6 w-6 text-indigo-600" />
                            {customer.name}'s Records
                          </SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(customer.measurements || {}).map(([key, val]) => (
                              <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{key}</p>
                                <p className="text-2xl font-bold text-slate-900">{val}<span className="text-sm ml-1 text-slate-400 font-normal">in</span></p>
                              </div>
                            ))}
                            {Object.keys(customer.measurements || {}).length === 0 && (
                              <p className="col-span-2 text-center text-slate-400 py-8 italic">No measurement data available</p>
                            )}
                          </div>
                          <Button className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700">Update Measurements</Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg border-slate-200">History</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <Users className="h-16 w-16 opacity-20" />
            <p className="text-xl">No clients found matching your search</p>
          </div>
        )}
      </div>
      <CustomerCreateDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </AppLayout>
  );
}