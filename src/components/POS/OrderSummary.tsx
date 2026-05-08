import React from 'react';
import { ShoppingCart, CreditCard, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOSStore } from '@/store/use-pos-store';
import { useAppStore } from '@/store/use-app-store';
import { useCreateOrder, useCustomers } from '@/hooks/use-api';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { CartItem } from './CartItem';
import { Order } from '@shared/types';
interface OrderSummaryProps {
  onOrderComplete?: (order: Order) => void;
}
export function OrderSummary({ onOrderComplete }: OrderSummaryProps) {
  const items = usePOSStore(useShallow((s) => s.items));
  const selectedCustomerId = usePOSStore(s => s.selectedCustomerId);
  const draftMeasurements = usePOSStore(useShallow((s) => s.draftMeasurements));
  const clearCart = usePOSStore(s => s.clearCart);
  const currency = useAppStore(s => s.currency);
  const { data: customersData } = useCustomers();
  const selectedCustomer = React.useMemo(() =>
    customersData?.items.find(c => c.id === selectedCustomerId),
    [customersData, selectedCustomerId]
  );
  const createOrder = useCreateOrder();
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const handleProcessOrder = async () => {
    if (!selectedCustomerId || !selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }
    if (items.length === 0) {
      toast.error('Atelier bench is empty. Please add items.');
      return;
    }
    try {
      const mappedItems = items.map(item => ({
        garmentId: 'custom',
        garmentName: item.type,
        quantity: 1,
        price: item.price,
        fabric: item.fabric,
        notes: item.notes,
      }));
      const newOrder = await createOrder.mutateAsync({
        customerId: selectedCustomerId,
        customerName: selectedCustomer.name,
        items: mappedItems as any,
        total,
        status: 'Pending',
        dueDate: Date.now() + 86400000 * 14,
        notes: JSON.stringify({ measurements: draftMeasurements })
      });
      toast.success('LEAfrique commission secured successfully!');
      if (onOrderComplete) {
        onOrderComplete(newOrder);
      }
      clearCart();
    } catch (error) {
      console.error('[POS] Order creation error:', error);
      toast.error('Failed to create order. Please check the logs.');
    }
  };
  return (
    <div className="flex flex-col h-full bg-brand-wheat/80 backdrop-blur-md">
      <div className="p-10 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-5 mb-10">
          <div className="p-4 rounded-2xl bg-brand-saddle text-brand-wheat shadow-2xl">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-4xl font-serif font-black text-brand-soil italic tracking-tight">Workbench</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-saddle/50">Active Commission Registry</p>
          </div>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto pr-3 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-saddle/30 space-y-8 py-10">
              <div className="p-10 rounded-full bg-brand-tan/10 border-4 border-dashed border-brand-tan/30">
                <Sparkles className="h-16 w-16" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-serif italic text-2xl text-brand-soil/40 font-bold">The artisan's bench is clear</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-saddle/30">Select garments from the library to begin</p>
              </div>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <div className="pt-10 mt-10 border-t-4 border-brand-tan/20 space-y-6">
          {selectedCustomer && (
            <div className="p-6 bg-brand-tan/10 rounded-[2rem] border-2 border-brand-saddle/10 shadow-sm">
              <p className="text-[11px] font-black text-brand-saddle/50 uppercase tracking-[0.4em] mb-2">Artisan Client</p>
              <p className="font-serif font-black text-brand-soil text-2xl italic">{selectedCustomer.name}</p>
            </div>
          )}
          <div className="space-y-3 px-2">
            <div className="flex items-center justify-between text-brand-soil/70 text-sm font-black uppercase tracking-widest">
              <span>Atelier Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-brand-soil/70 text-sm font-black uppercase tracking-widest">
              <span>VAT (5%)</span>
              <span className="font-mono">{formatPrice(tax, currency)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-dashed border-brand-tan/50 px-2">
            <span className="text-3xl font-serif font-black text-brand-soil tracking-tight">Master Total</span>
            <span className="text-5xl font-sans font-black text-brand-saddle tracking-tighter">
              {formatPrice(total, currency)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-10 bg-brand-tan/10 border-t-2 border-brand-tan/20">
        <Button
          className="w-full h-24 text-2xl font-black bg-brand-forest hover:bg-brand-moss text-brand-wheat rounded-[2.5rem] shadow-2xl transition-all active:scale-95 gap-6 disabled:bg-brand-soil/10 disabled:text-brand-soil/20 leather-edge"
          disabled={items.length === 0 || !selectedCustomerId || createOrder.isPending}
          onClick={handleProcessOrder}
        >
          {createOrder.isPending ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-8 w-8" />
              Secure Commission
              <ChevronRight className="h-8 w-8 ml-auto opacity-40" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}