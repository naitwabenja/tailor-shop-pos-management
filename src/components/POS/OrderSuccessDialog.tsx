import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order } from '@shared/types';
import { ReceiptView } from './ReceiptView';
import { usePOSStore } from '@/store/use-pos-store';
interface OrderSuccessDialogProps {
  order: Order | null;
  onClose: () => void;
}
export function OrderSuccessDialog({ order, onClose }: OrderSuccessDialogProps) {
  const clearCart = usePOSStore(s => s.clearCart);
  const [showReceipt, setShowReceipt] = React.useState(false);
  if (!order) return null;
  const handleNewTransaction = () => {
    clearCart();
    onClose();
  };
  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Order Successful</DialogTitle>
          <DialogDescription>
            The order has been processed and saved to the production queue.
          </DialogDescription>
        </DialogHeader>
        {!showReceipt ? (
          <div className="p-12 text-center space-y-8">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Commission Secured</h2>
              <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">
                The order for <span className="text-indigo-600 font-bold">{order.customerName}</span> has been successfully logged.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-2 border-slate-100 font-bold gap-2 text-slate-700"
                onClick={() => setShowReceipt(true)}
              >
                <Printer className="h-5 w-5" /> View Receipt
              </Button>
              <Button
                className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold gap-2"
                onClick={handleNewTransaction}
              >
                <RefreshCw className="h-5 w-5" /> New Transaction
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Order Receipt</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowReceipt(false)} className="text-slate-500">Back</Button>
            </div>
            <div className="print-area">
              <ReceiptView order={order} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}