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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-0 border-none shadow-2xl bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Commission Secured</DialogTitle>
          <DialogDescription>
            The bespoke order has been successfully logged into the atelier's master registry.
          </DialogDescription>
        </DialogHeader>
        {!showReceipt ? (
          <div className="p-16 text-center space-y-10">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="h-32 w-32 rounded-[2rem] bg-brand-green text-white flex items-center justify-center shadow-2xl shadow-brand-green/30"
              >
                <CheckCircle2 className="h-16 w-16" />
              </motion.div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold text-brand-brown tracking-tight italic">Commission Secured</h2>
              <p className="text-brand-brown/60 max-w-sm mx-auto text-lg font-medium leading-relaxed">
                The masterpiece for <span className="text-brand-brown font-extrabold underline decoration-brand-brown/20">{order.customerName}</span> has been formally registered.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                variant="outline"
                className="flex-1 h-16 rounded-2xl border-2 border-brand-brown/10 font-bold gap-3 text-brand-brown text-lg hover:bg-brand-brown/5"
                onClick={() => setShowReceipt(true)}
              >
                <Printer className="h-6 w-6" /> View Registry Entry
              </Button>
              <Button
                className="flex-1 h-16 rounded-2xl bg-brand-brown hover:bg-brand-green shadow-xl shadow-brand-brown/20 font-bold gap-3 text-lg transition-all active:scale-95"
                onClick={handleNewTransaction}
              >
                <RefreshCw className="h-6 w-6" /> New Transaction
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-10 bg-brand-brown/5">
            <div className="flex items-center justify-between mb-8 px-4">
              <h3 className="font-bold text-brand-brown/40 uppercase tracking-[0.4em] text-[10px]">Artisan Receipt Registry</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowReceipt(false)} className="text-brand-brown font-bold hover:bg-brand-brown/10">Return to Status</Button>
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