import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  UserPlus,
  Scissors,
  Loader2,
  PackageOpen
} from 'lucide-react';
import { MOCK_GARMENT_TYPES } from '@shared/mock-data';
import { cn } from '@/lib/utils';
import { usePOSStore } from '@/store/use-pos-store';
import { useCustomers } from '@/hooks/use-api';
import { MeasurementForm } from '@/components/POS/MeasurementForm';
import { OrderSummary } from '@/components/POS/OrderSummary';
import { CustomerCreateDialog } from '@/components/customers/CustomerCreateDialog';
import { OrderSuccessDialog } from '@/components/POS/OrderSuccessDialog';
import { Order } from '@shared/types';
export default function POSPage() {
  const selectedCustomerId = usePOSStore((s) => s.selectedCustomerId);
  const setCustomer = usePOSStore((s) => s.setCustomer);
  const addItem = usePOSStore((s) => s.addItem);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const filteredCustomers = customersData?.items.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  ).slice(0, 4) || [];
  return (
    <AppLayout fullBleed contentClassName="flex flex-col h-[calc(100vh-theme(spacing.14))] lg:h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden h-full">
        {/* Left Side: Order Configuration */}
        <div className="lg:col-span-8 flex flex-col overflow-y-auto p-6 space-y-8 bg-slate-50 dark:bg-slate-950">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-600" />
                Select Client
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl"
                onClick={() => setIsCustomerDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4" /> New Customer
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10 h-12 rounded-xl bg-white shadow-sm border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {customersLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-indigo-600" /></div>
            ) : filteredCustomers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => setCustomer(customer.id, customer.measurements)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2",
                      selectedCustomerId === customer.id
                        ? "bg-indigo-50 border-indigo-600 shadow-md"
                        : "bg-white border-transparent hover:border-indigo-200 shadow-sm"
                    )}
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">No clients found. Use the "New Customer" button to add one.</div>
            )}
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Scissors className="h-5 w-5 text-indigo-600" />
              Garment Library
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_GARMENT_TYPES.map(type => (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-none shadow-sm active:scale-95 duration-75 overflow-hidden group"
                  onClick={() => addItem({ type: type.name, price: type.basePrice })}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-2 group-hover:bg-indigo-50 transition-colors">
                    <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="font-bold text-slate-900">{type.name}</div>
                    <div className="text-sm font-medium text-slate-500">From ${type.basePrice}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          {selectedCustomerId && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Today's Measurements</h2>
                <Button variant="link" className="text-indigo-600 font-semibold p-0">Detailed History</Button>
              </div>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <MeasurementForm />
                </CardContent>
              </Card>
            </section>
          )}
        </div>
        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          <OrderSummary onOrderComplete={(order) => setCompletedOrder(order)} />
        </div>
      </div>
      <CustomerCreateDialog 
        open={isCustomerDialogOpen} 
        onOpenChange={setIsCustomerDialogOpen}
        onSuccess={(customer) => setCustomer(customer.id, customer.measurements)}
      />
      <OrderSuccessDialog 
        order={completedOrder} 
        onClose={() => setCompletedOrder(null)} 
      />
    </AppLayout>
  );
}