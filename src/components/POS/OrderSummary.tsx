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
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-brand-brown text-white shadow-lg shadow-brand-brown/20">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-brown italic">Checkout</h2>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-brown/30 space-y-4">
              <div className="p-6 rounded-full bg-brand-brown/5 border border-dashed border-brand-brown/10">
                <ShoppingCart className="h-12 w-12" />
              </div>
              <p className="font-serif italic">The workbench is currently empty</p>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <div className="pt-6 mt-6 border-t border-brand-brown/10 space-y-4">
          {selectedCustomer && (
            <div className="mb-4 p-4 bg-brand-brown/5 rounded-2xl border border-brand-brown/10">
              <p className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-widest mb-1">Commission for</p>
              <p className="font-bold text-brand-brown text-lg">{selectedCustomer.name}</p>
            </div>
          )}
          <div className="flex items-center justify-between text-brand-brown/70 text-sm font-bold">
            <span>Commission Subtotal</span>
            <span className="font-mono">{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex items-center justify-between text-brand-brown/70 text-sm font-bold">
            <span>Atelier VAT (5%)</span>
            <span className="font-mono">{formatPrice(tax, currency)}</span>
          </div>
          <div className="flex items-center justify-between text-3xl font-serif font-bold text-brand-brown pt-2 border-t border-dashed border-brand-brown/20">
            <span>Total</span>
            <span className="font-sans font-bold">{formatPrice(total, currency)}</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-brand-brown/5 border-t border-brand-brown/10">
        <Button
          className="w-full h-16 text-lg font-bold bg-brand-brown hover:bg-brand-green text-white rounded-2xl shadow-xl shadow-brand-brown/20 dark:shadow-none gap-3 transition-all active:scale-95"
          disabled={items.length === 0 || !selectedCustomerId || createOrder.isPending}
          onClick={handleProcessOrder}
        >
          {createOrder.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-6 w-6" />
              Process Commission
              <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}