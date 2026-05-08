import React from 'react';
import { Order, OrderItem } from '@shared/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Printer, Scissors } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAppStore } from '@/store/use-app-store';
interface ReceiptViewProps {
  order: Order;
}
export function ReceiptView({ order }: ReceiptViewProps) {
  const currency = useAppStore((s) => s.currency);
  const handlePrint = () => {
    window.print();
  };
  const subtotal = order.total / 1.05;
  const tax = order.total - subtotal;
  return (
    <div className="bg-brand-wheat p-10 max-w-md mx-auto shadow-2xl rounded-3xl border border-brand-tan/50 print:shadow-none print:border-none print:p-0 print:bg-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,180,140,0.05)_0%,transparent_100%)] pointer-events-none" />
      <div className="text-center space-y-3 mb-10 relative z-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-saddle text-brand-wheat mb-4 shadow-xl">
          <Scissors className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-serif font-bold tracking-tighter uppercase italic text-brand-saddle">LEAfrique</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-forest">Master Tailors & Artisans</p>
      </div>
      <div className="border-t border-b border-dashed border-brand-tan/80 py-6 mb-8 space-y-2 relative z-10">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-soil/60">
          <span>Artisan Ref:</span>
          <span className="font-mono text-brand-soil">#{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-soil/60">
          <span>Registry Date:</span>
          <span className="text-brand-soil">{format(order.createdAt, 'MMM dd, yyyy • HH:mm')}</span>
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-soil/60">
          <span>Client:</span>
          <span className="font-serif font-bold text-brand-saddle text-sm underline decoration-brand-tan">{order.customerName}</span>
        </div>
      </div>
      <div className="space-y-6 mb-10 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-forest/60">Bespoke Commission Details</p>
        {order.items.map((item: OrderItem, idx: number) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between font-serif font-bold text-lg text-brand-soil">
              <span>{item.garmentName}</span>
              <span className="font-sans text-brand-saddle">{formatPrice(item.price, currency)}</span>
            </div>
            {item.fabric && (
              <p className="text-xs text-brand-forest font-bold italic bg-brand-forest/5 px-2 py-1 rounded-md inline-block">Fabric: {item.fabric}</p>
            )}
            {item.notes && (
              <p className="text-xs text-brand-soil/70 leading-relaxed pl-2 border-l-2 border-brand-tan/50">
                <span className="font-black text-[10px] uppercase block mb-1 text-brand-soil/40">Tailor Notes</span>
                {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-brand-tan/30 pt-6 space-y-3 relative z-10">
        <div className="flex justify-between text-xs font-black text-brand-soil/50">
          <span>Commission Subtotal</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-xs font-black text-brand-soil/50">
          <span>Value Added Tax (5%)</span>
          <span>{formatPrice(tax, currency)}</span>
        </div>
        <div className="flex justify-between text-2xl font-serif font-bold pt-4 border-t border-dashed border-brand-tan/80 text-brand-saddle">
          <span>Total</span>
          <span className="font-sans">{formatPrice(order.total, currency)}</span>
        </div>
      </div>
      <div className="mt-14 text-center space-y-6 relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-soil/40 leading-relaxed">
            Thank you for entrusting your style to LEAfrique.<br />
            Your masterpiece will be ready for fitting by
          </p>
          <p className="text-lg font-serif font-bold text-brand-forest italic">{format(order.dueDate, 'MMMM dd, yyyy')}</p>
        </div>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="w-full print:hidden h-14 gap-3 rounded-2xl border-2 border-brand-saddle text-brand-saddle font-bold hover:bg-brand-saddle hover:text-brand-wheat transition-all"
        >
          <Printer className="h-5 w-5" /> Finalize & Print
        </Button>
      </div>
      <div className="mt-8 pt-8 border-t border-dashed border-brand-tan flex justify-center opacity-40">
        <div className="h-1.5 w-1.5 rounded-full bg-brand-saddle mx-1" />
        <div className="h-1.5 w-1.5 rounded-full bg-brand-saddle mx-1" />
        <div className="h-1.5 w-1.5 rounded-full bg-brand-saddle mx-1" />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />
    </div>
  );
}