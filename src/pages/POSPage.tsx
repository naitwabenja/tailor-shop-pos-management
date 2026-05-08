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
} from 'lucide-react';
import { MOCK_GARMENT_TYPES } from '@shared/mock-data';
import { cn, formatPrice } from '@/lib/utils';
import { usePOSStore } from '@/store/use-pos-store';
import { useCustomers, useGarments } from '@/hooks/use-api';
import { MeasurementForm } from '@/components/POS/MeasurementForm';
import { OrderSummary } from '@/components/POS/OrderSummary';
import { CustomerCreateDialog } from '@/components/customers/CustomerCreateDialog';
import { OrderSuccessDialog } from '@/components/POS/OrderSuccessDialog';
import { useAppStore } from '@/store/use-app-store';
import { Order } from '@shared/types';
export default function POSPage() {
  const selectedCustomerId = usePOSStore((s) => s.selectedCustomerId);
  const setCustomer = usePOSStore((s) => s.setCustomer);
  const addItem = usePOSStore((s) => s.addItem);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const currency = useAppStore(s => s.currency);
  const { data: garmentsData, isLoading: garmentsLoading } = useGarments();
  const filteredCustomers = customersData?.items.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  ).slice(0, 4) || [];
  const garmentLibrary = garmentsData && garmentsData.length > 0
    ? garmentsData.map(g => ({ id: g.id, name: g.name, basePrice: g.basePrice }))
    : MOCK_GARMENT_TYPES;
  return (
    <AppLayout fullBleed contentClassName="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden h-full">
        {/* Left Side: Inputs and Selection */}
        <div className="lg:col-span-8 flex flex-col flex-1 min-w-0 overflow-y-auto p-8 md:p-10 space-y-12 bg-background/50 custom-scrollbar">
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif font-black flex items-center gap-4 text-black italic">
                <div className="p-3 bg-black text-white rounded-2xl shadow-lg">
                  <Search className="h-6 w-6" />
                </div>
                Select Client
              </h2>
              <Button
                variant="outline"
                className="gap-3 rounded-2xl border-black/10 text-black bg-white hover:bg-black hover:text-white h-14 px-8 font-black shadow-sm"
                onClick={() => setIsCustomerDialogOpen(true)}
              >
                <UserPlus className="h-5 w-5" /> New Customer
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-5 top-5 h-6 w-6 text-black/20" />
              <Input
                placeholder="Search clients by name or identification..."
                className="pl-14 h-16 rounded-[1.5rem] bg-white border-black/5 focus-visible:ring-black shadow-xl shadow-black/5 text-xl font-bold placeholder:text-black/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {customersLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-black h-10 w-10" /></div>
            ) : filteredCustomers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => setCustomer(customer.id, customer.measurements)}
                    className={cn(
                      "flex items-center gap-6 p-8 rounded-3xl cursor-pointer transition-all border-2",
                      selectedCustomerId === customer.id
                        ? "bg-black border-black text-white shadow-2xl scale-[1.02]"
                        : "bg-white border-transparent hover:border-black/10 shadow-soft"
                    )}
                  >
                    <div className={cn(
                      "h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl",
                      selectedCustomerId === customer.id ? "bg-white text-black" : "bg-black text-white"
                    )}>
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xl truncate">{customer.name}</div>
                      <div className={cn("text-sm font-black opacity-60", selectedCustomerId === customer.id ? "text-white" : "text-black")}>
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-black/30 text-xl font-serif italic bg-black/5 rounded-3xl border-2 border-dashed border-black/10">
                Registry search returned no results.
              </div>
            )}
          </section>
          <section className="space-y-8">
            <h2 className="text-3xl font-serif font-black flex items-center gap-4 text-black italic">
              <div className="p-3 bg-black text-white rounded-2xl shadow-lg">
                <Scissors className="h-6 w-6" />
              </div>
              Garment Library
            </h2>
            {garmentsLoading ? (
              <div className="flex justify-center p-16"><Loader2 className="animate-spin text-black h-12 w-12" /></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {garmentLibrary.map(type => (
                  <Card
                    key={type.id}
                    className="cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all border-none shadow-soft active:scale-95 duration-75 overflow-hidden group bg-white"
                    onClick={() => addItem({ type: type.name, price: type.basePrice })}
                  >
                    <CardContent className="p-10 flex flex-col items-center text-center gap-6 group-hover:bg-black/5 transition-colors">
                      <div className="p-6 rounded-[2rem] bg-black/5 text-black group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                        <Plus className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="font-black text-black text-2xl tracking-tight">{type.name}</div>
                        <div className="text-lg font-serif font-black italic text-black/40">From {formatPrice(type.basePrice, currency)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
          {selectedCustomerId && (
            <section className="space-y-8 pb-16" key={selectedCustomerId}>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-black text-black italic">Artisan Metrics</h2>
                <Button variant="link" className="text-black font-black p-0 text-lg decoration-black/20">Metrics History</Button>
              </div>
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-10">
                  <MeasurementForm />
                </CardContent>
              </Card>
            </section>
          )}
        </div>
        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 bg-white border-l border-black/5 flex flex-col overflow-hidden shadow-2xl relative z-20">
          <OrderSummary onOrderComplete={setCompletedOrder} />
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