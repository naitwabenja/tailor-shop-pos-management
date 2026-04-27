import React from 'react';
import { ShoppingCart, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOSStore } from '@/store/use-pos-store';
import { useCreateOrder, useCustomers } from '@/hooks/use-api';
import { toast } from 'sonner';
import { CartItem } from './CartItem';
import { Order } from '@shared/types';
interface OrderSummaryProps {
  onOrderComplete?: (order: Order) => void;
}
export function OrderSummary({ onOrderComplete }: OrderSummaryProps) {
  const items = usePOSStore((s) => s.items);
  const selectedCustomerId = usePOSStore((s) => s.selectedCustomerId);
  const draftMeasurements = usePOSStore((s) => s.draftMeasurements);
  const clearCart = usePOSStore((s) => s.clearCart);
  const { data: customersData } = useCustomers();
  const selectedCustomer = customersData?.items.find(c => c.id === selectedCustomerId);
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
      // Map local POS items to backend OrderItem structure
      // The API handler in worker/user-routes.ts maps 'type' to 'garmentName'
      const mappedItems = items.map(item => ({
        type: item.type,
        price: item.price,
        notes: item.notes,
        fabric: item.fabric,
      }));
      const newOrder = await createOrder.mutateAsync({
        customerId: selectedCustomerId,
        customerName: selectedCustomer.name,
        // The mutationFn in use-api expects Partial<Order>, but the API handler maps items
        items: mappedItems as any,
        total,
        status: 'Pending',
        dueDate: Date.now() + 86400000 * 14,
        // Send measurements in notes JSON for the backend to process
        notes: JSON.stringify({ measurements: draftMeasurements })
      });
      toast.success('Order created successfully!');
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
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Order Summary</h2>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="p-4 rounded-full bg-slate-50">
                <ShoppingCart className="h-12 w-12" />
              </div>
              <p>No garments added yet</p>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
          {selectedCustomer && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Client</p>
              <p className="font-bold text-indigo-900">{selectedCustomer.name}</p>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-600 text-sm font-medium">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-sm font-medium">
            <span>Tax (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-2xl font-bold text-slate-900 pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-slate-50 dark:bg-slate-950/50">
        <Button
          className="w-full h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none gap-3"
          disabled={items.length === 0 || !selectedCustomerId || createOrder.isPending}
          onClick={handleProcessOrder}
        >
          {createOrder.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-6 w-6" />
              Process Order
              <ChevronRight className="h-5 w-5 ml-auto" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}