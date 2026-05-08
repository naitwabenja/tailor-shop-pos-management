import React from 'react';
import { ShoppingCart, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
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
      console.error('Order creation error:', error);
      toast.error('Failed to create order');
    }
  };
  return (
    <div className="flex flex-col h-full bg-brand-wheat">
      <div className="p-8 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-brand-saddle text-brand-wheat shadow-xl">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-soil italic">Workbench</h2>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-saddle/30 space-y-6">
              <div className="p-8 rounded-full bg-brand-tan/10 border-2 border-dashed border-brand-tan/40">
                <ShoppingCart className="h-14 w-14" />
              </div>
              <p className="font-serif italic text-lg text-brand-soil/40">The artisan's bench is clear</p>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <div className="pt-8 mt-8 border-t-2 border-brand-tan/30 space-y-5">
          {selectedCustomer && (
            <div className="mb-6 p-5 bg-brand-tan/10 rounded-[1.5rem] border-2 border-brand-saddle/10">
              <p className="text-[10px] font-black text-brand-saddle/40 uppercase tracking-[0.3em] mb-1">Commission for</p>
              <p className="font-bold text-brand-soil text-xl">{selectedCustomer.name}</p>
            </div>
          )}
          <div className="flex items-center justify-between text-brand-soil/60 text-sm font-bold">
            <span>Atelier Subtotal</span>
            <span className="font-mono">{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex items-center justify-between text-brand-soil/60 text-sm font-bold">
            <span>Value Added Tax (5%)</span>
            <span className="font-mono">{formatPrice(tax, currency)}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-dashed border-brand-tan/50">
            <span className="text-2xl font-serif font-bold text-brand-soil">Total</span>
            <span className="text-4xl font-sans font-black text-brand-saddle tracking-tighter">
              {formatPrice(total, currency)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-8 bg-brand-tan/5 border-t border-brand-tan/20">
        <Button
          className="w-full h-20 text-xl font-bold bg-brand-forest hover:bg-brand-moss text-brand-wheat rounded-3xl shadow-2xl transition-all active:scale-95 gap-4 disabled:bg-brand-soil/10 disabled:text-brand-soil/20"
          disabled={items.length === 0 || !selectedCustomerId || createOrder.isPending}
          onClick={handleProcessOrder}
        >
          {createOrder.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-7 w-7" />
              Secure Commission
              <ChevronRight className="h-6 w-6 ml-auto opacity-40" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}