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
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 group hover:bg-slate-100 transition-all border border-transparent hover:border-indigo-100">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-bold text-slate-900">{item.type}</div>
          {item.notes && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-indigo-400">
                  <Info className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="text-xs text-slate-600 bg-white shadow-xl rounded-xl border-slate-100 p-3">
                <span className="font-bold text-indigo-600">Tailor Notes:</span> {item.notes}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="text-sm text-indigo-600 font-bold flex items-center gap-2">
          {formatPrice(item.price, currency)}
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
            Base
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 rounded-2xl shadow-2xl border-indigo-50">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fabric/Design Notes</p>
              <Input
                placeholder="e.g. Italian Wool, Slim Cuff..."
                className="text-sm rounded-xl"
                defaultValue={item.notes}
                onBlur={(e) => updateItem(item.id, { notes: e.target.value })}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}