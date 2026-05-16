import React, { useState } from 'react';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden h-full">
      {/* Left Side: Inputs and Selection */}
      <div className="lg:col-span-8 flex flex-col flex-1 min-w-0 overflow-y-auto p-6 md:p-8 space-y-8 bg-background/50 custom-scrollbar">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-foreground italic">
              <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-md">
                <Search className="h-5 w-5" />
              </div>
              Select Client
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-2 border-border text-foreground bg-card hover:bg-primary hover:text-primary-foreground h-11 px-6 font-bold shadow-sm"
              onClick={() => setIsCustomerDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" /> New Customer
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-foreground/20" />
            <Input
              placeholder="Search clients by name or identification..."
              className="pl-12 h-12 rounded-xl bg-card border-2 border-border focus-visible:ring-primary shadow-lg shadow-foreground/5 text-lg font-bold placeholder:text-foreground/20 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {customersLoading ? (
            <div className="flex justify-center p-6"><Loader2 className="animate-spin text-foreground h-8 w-8" /></div>
          ) : filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => setCustomer(customer.id, customer.measurements)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2",
                    selectedCustomerId === customer.id
                      ? "bg-primary border-primary text-primary-foreground shadow-xl scale-[1.01]"
                      : "bg-card border-transparent hover:border-border shadow-sm text-foreground"
                  )}
                >
                  <div className={cn(
                    "h-11 w-11 shrink-0 rounded-lg flex items-center justify-center font-bold text-lg",
                    selectedCustomerId === customer.id ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                  )}>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-lg truncate leading-tight">{customer.name}</div>
                    <div className={cn("text-xs font-bold opacity-60", selectedCustomerId === customer.id ? "text-primary-foreground" : "text-foreground")}>
                      {customer.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-foreground/30 text-lg font-serif italic bg-foreground/5 rounded-2xl border-2 border-dashed border-border">
              Registry search returned no results.
            </div>
          )}
        </section>
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-foreground italic">
            <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-md">
              <Scissors className="h-5 w-5" />
            </div>
            Garment Library
          </h2>
          {garmentsLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-foreground h-10 w-10" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {garmentLibrary.map(type => (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all border-none shadow-sm active:scale-95 duration-75 overflow-hidden group bg-card"
                  onClick={() => addItem({ type: type.name, price: type.basePrice })}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4 group-hover:bg-foreground/5 transition-colors">
                    <div className="p-4 rounded-2xl bg-foreground/5 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-foreground text-lg tracking-tight leading-tight">{type.name}</div>
                      <div className="text-sm font-serif font-bold italic text-foreground/40">From {formatPrice(type.basePrice, currency)}</div>
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
              <h2 className="text-2xl font-serif font-bold text-foreground italic">Artisan Metrics</h2>
              <Button variant="link" size="sm" className="text-foreground font-bold p-0 text-base decoration-foreground/20">Metrics History</Button>
            </div>
            <Card className="border-none shadow-lg bg-card rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <MeasurementForm />
              </CardContent>
            </Card>
          </section>
        )}
      </div>
      {/* Right Side: Order Summary */}
      <div className="lg:col-span-4 bg-card border-l border-border flex flex-col overflow-hidden shadow-xl relative z-20">
        <OrderSummary onOrderComplete={setCompletedOrder} />
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
    </div>
  );
}