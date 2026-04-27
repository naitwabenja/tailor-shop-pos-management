import React from 'react';
import { Order, OrderItem } from '@shared/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Printer, Scissors } from 'lucide-react';
interface ReceiptViewProps {
  order: Order;
}
export function ReceiptView({ order }: ReceiptViewProps) {
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="bg-white p-8 max-w-md mx-auto shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-2">
          <Scissors className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase italic">Stitch</h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-500">Master Tailors & Clothiers</p>
      </div>
      <div className="border-t border-b border-dashed border-slate-200 py-4 mb-6 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Order Ref:</span>
          <span className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Date:</span>
          <span>{format(order.createdAt, 'MMM dd, yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Customer:</span>
          <span className="font-bold">{order.customerName}</span>
        </div>
      </div>
      <div className="space-y-4 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Garment Commission</p>
        {order.items.map((item: OrderItem, idx: number) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between font-bold text-sm">
              <span>{item.garmentName}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
            {item.fabric && (
              <p className="text-xs text-slate-500 italic">Fabric: {item.fabric}</p>
            )}
            {item.notes && (
              <p className="text-[10px] text-slate-400 leading-relaxed">Notes: {item.notes}</p>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span>${(order.total / 1.05).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Tax (5%)</span>
          <span>${(order.total - (order.total / 1.05)).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-100">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-12 text-center space-y-4">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Thank you for choosing Stitch.<br />
          Your bespoke garment will be ready by {format(order.dueDate, 'MMM dd')}.
        </p>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="w-full print:hidden gap-2 rounded-xl border-slate-200"
        >
          <Printer className="h-4 w-4" /> Print Receipt
        </Button>
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