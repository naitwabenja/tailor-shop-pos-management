import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  Filter
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '@shared/mock-data';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
            <p className="text-slate-500">Manage client profiles and measurement records</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-lg shadow-indigo-100">
            <UserPlus className="h-5 w-5" /> Add New Customer
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
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200">
            <Filter className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
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
                    <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-600 font-medium">Regular Client</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem>View Measurements</DropdownMenuItem>
                    <DropdownMenuItem>Order History</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Client</DropdownMenuItem>
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
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Last seen {customer.lastVisitAt ? format(customer.lastVisitAt, 'MMM d, yyyy') : 'Never'}
                  </div>
                </div>
                <div className="pt-4 flex gap-2 border-t border-slate-100">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">Measurements</Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">New Order</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <Users className="h-16 w-16 opacity-20" />
            <p className="text-xl">No customers found matching your search</p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}