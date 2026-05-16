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
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const bespokeCount = items.filter(i => i.itemType === 'bespoke').length;
  const retailCount = items.filter(i => i.itemType === 'retail').reduce((acc, i) => acc + i.quantity, 0);
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
        garmentId: item.inventoryItemId ? item.inventoryItemId : 'custom',
        garmentName: item.type,
        quantity: item.quantity,
        price: item.price,
        fabric: item.fabric,
        notes: item.notes,
        inventoryItemId: item.inventoryItemId,
        itemType: item.itemType
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
    } catch (error: any) {
      console.error('[POS] Order creation error:', error);
      toast.error(error.message || 'Failed to create order.');
    }
  };
  return (
    <div className="flex flex-col h-full bg-card/80 backdrop-blur-md">
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-accent text-accent-foreground shadow-lg">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground italic tracking-tight">Workbench</h2>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/50">Active Commission Registry</p>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-foreground/30 space-y-6 py-8">
              <div className="p-6 rounded-full bg-foreground/5 border-2 border-dashed border-border">
                <Sparkles className="h-10 w-10" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-serif italic text-lg text-foreground/40 font-bold">The bench is clear</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Select garments or stock to begin</p>
              </div>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <div className="pt-6 mt-4 border-t-2 border-border space-y-6">
          <div className="flex items-center justify-between px-1">
             <div className="flex flex-col">
               <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Bespoke Pieces</span>
               <span className="font-black text-sm text-foreground">{bespokeCount}</span>
             </div>
             <div className="flex flex-col text-right">
               <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Stock Items</span>
               <span className="font-black text-sm text-foreground">{retailCount}</span>
             </div>
          </div>
          {selectedCustomer && (
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 shadow-sm">
              <p className="text-[9px] font-bold text-accent uppercase tracking-[0.2em] mb-1">Artisan Client</p>
              <p className="font-serif font-bold text-foreground text-xl italic">{selectedCustomer.name}</p>
            </div>
          )}
          <div className="space-y-3 px-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-black uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-foreground/60 text-xs font-black uppercase tracking-widest">
              <span>VAT (5%)</span>
              <span className="font-mono">{formatPrice(tax, currency)}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-border">
              <span className="text-xl font-serif font-bold text-foreground tracking-tight">Total Valuation</span>
              <span className="text-3xl font-sans font-black text-accent tracking-tighter">
                {formatPrice(total, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-accent/5 border-t border-border">
        <Button
          className="w-full h-16 text-xl font-black bg-primary hover:opacity-90 text-primary-foreground rounded-2xl shadow-xl transition-all active:scale-[0.98] active:shadow-inner gap-4 disabled:bg-foreground/10 disabled:text-foreground/20 group overflow-hidden relative"
          disabled={items.length === 0 || !selectedCustomerId || createOrder.isPending}
          onClick={handleProcessOrder}
        >
          {createOrder.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-6 w-6 relative z-10" />
              <span className="relative z-10">Secure Masterpiece</span>
              <ChevronRight className="h-6 w-6 ml-auto opacity-40 group-hover:translate-x-1 transition-transform relative z-10" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}