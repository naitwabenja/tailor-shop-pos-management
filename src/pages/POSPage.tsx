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
        <div className="lg:col-span-8 flex flex-col overflow-y-auto p-8 space-y-10 bg-background/30 dark:bg-slate-950/50 custom-scrollbar">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-brand-brown">
                <Search className="h-6 w-6" />
                Select Client
              </h2>
              <Button
                variant="outline"
                className="gap-3 rounded-2xl border-brand-brown/20 text-brand-brown hover:bg-brand-brown/10 h-12 px-6 font-bold"
                onClick={() => setIsCustomerDialogOpen(true)}
              >
                <UserPlus className="h-5 w-5" /> New Customer
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-brand-brown/40" />
              <Input
                placeholder="Search clients by name or phone..."
                className="pl-12 h-14 rounded-2xl bg-white/80 backdrop-blur-sm border-brand-brown/10 focus-visible:ring-brand-brown shadow-sm text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {customersLoading ? (
              <div className="flex justify-center p-6"><Loader2 className="animate-spin text-brand-brown h-8 w-8" /></div>
            ) : filteredCustomers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => setCustomer(customer.id, customer.measurements)}
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-2xl cursor-pointer transition-all border-2",
                      selectedCustomerId === customer.id
                        ? "bg-brand-brown/10 border-brand-brown shadow-lg"
                        : "bg-white/50 border-transparent hover:border-brand-brown/20 shadow-sm"
                    )}
                  >
                    <div className="h-12 w-12 rounded-full bg-brand-tan/30 flex items-center justify-center font-bold text-brand-brown text-lg">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-brand-brown text-lg">{customer.name}</div>
                      <div className="text-sm text-brand-brown/60 font-medium">{customer.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-brand-brown/40 text-lg italic bg-white/30 rounded-2xl border border-dashed border-brand-brown/10">
                No clients found in registry.
              </div>
            )}
          </section>
          <section className="space-y-6">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-brand-brown">
              <Scissors className="h-6 w-6" />
              Garment Library
            </h2>
            {garmentsLoading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-brown h-10 w-10" /></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {garmentLibrary.map(type => (
                  <Card
                    key={type.id}
                    className="cursor-pointer hover:shadow-xl transition-all border-none shadow-soft active:scale-95 duration-75 overflow-hidden group"
                    onClick={() => addItem({ type: type.name, price: type.basePrice })}
                  >
                    <CardContent className="p-8 flex flex-col items-center text-center gap-4 group-hover:bg-brand-brown/5 transition-colors">
                      <div className="p-5 rounded-[1.5rem] bg-brand-brown/10 text-brand-brown group-hover:bg-brand-brown group-hover:text-white transition-all shadow-sm">
                        <Plus className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-brand-brown text-xl">{type.name}</div>
                        <div className="text-base font-serif font-bold italic text-brand-brown/60">From {formatPrice(type.basePrice, currency)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
          {selectedCustomerId && (
            <section className="space-y-6 pb-12" key={selectedCustomerId}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-brand-brown">Artisan Metrics</h2>
                <Button variant="link" className="text-brand-brown font-bold p-0 decoration-brand-brown/30 text-base">History</Button>
              </div>
              <Card className="border-none shadow-soft bg-white/40 backdrop-blur-sm rounded-[2rem]">
                <CardContent className="p-8">
                  <MeasurementForm />
                </CardContent>
              </Card>
            </section>
          )}
        </div>
        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-md dark:bg-slate-900 border-l border-brand-brown/10 flex flex-col overflow-hidden shadow-2xl">
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