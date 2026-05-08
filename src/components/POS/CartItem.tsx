import React from 'react';
import { Trash2, MessageSquare, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePOSStore } from '@/store/use-pos-store';
import { useAppStore } from '@/store/use-app-store';
import { formatPrice } from '@/lib/utils';
import type { GarmentItem } from '@shared/types';
interface CartItemProps {
  item: GarmentItem;
}
export function CartItem({ item }: CartItemProps) {
  const removeItem = usePOSStore((s) => s.removeItem);
  const updateItem = usePOSStore((s) => s.updateItem);
  const currency = useAppStore(s => s.currency);
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-brand-brown/10 group hover:border-brand-brown/30 hover:shadow-soft transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-bold text-brand-brown text-lg">{item.type}</div>
          {item.notes && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-brand-brown/40 hover:text-brand-brown">
                  <Info className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="text-xs text-brand-brown bg-white shadow-xl rounded-2xl border-brand-brown/10 p-4">
                <span className="font-bold text-brand-green uppercase tracking-widest block mb-1">Tailor Specification:</span> 
                {item.notes}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="text-sm text-brand-brown font-bold flex items-center gap-3">
          <span className="font-mono">{formatPrice(item.price, currency)}</span>
          <span className="text-[9px] text-brand-brown/40 uppercase font-extrabold tracking-[0.2em] bg-brand-brown/5 px-2 py-0.5 rounded-md border border-brand-brown/10">
            Artisan Rate
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-brand-brown/30 hover:text-brand-brown hover:bg-brand-brown/5 rounded-full h-10 w-10"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-5 rounded-2xl shadow-2xl border-brand-brown/10 bg-white/95 backdrop-blur-sm">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-widest">Fabric & Artistic Details</p>
              <Input
                placeholder="e.g. Italian Silk, French Cuff, Custom Lining..."
                className="text-sm rounded-xl border-brand-brown/10 focus-visible:ring-brand-brown h-12"
                defaultValue={item.notes}
                onBlur={(e) => updateItem(item.id, { notes: e.target.value })}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          className="text-brand-brown/20 hover:text-red-500 hover:bg-red-50 rounded-full h-10 w-10 transition-all active:scale-90"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}