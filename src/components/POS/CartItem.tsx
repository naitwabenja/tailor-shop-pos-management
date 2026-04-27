import React from 'react';
import { Trash2, MessageSquare, Plus, Minus, Package, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePOSStore } from '@/store/use-pos-store';
import { useAppStore } from '@/store/use-app-store';
import { formatPrice, cn } from '@/lib/utils';
import type { GarmentItem } from '@shared/types';
import { Badge } from '@/components/ui/badge';
interface CartItemProps {
  item: GarmentItem;
}
export function CartItem({ item }: CartItemProps) {
  const removeItem = usePOSStore((s) => s.removeItem);
  const updateItem = usePOSStore((s) => s.updateItem);
  const updateQuantity = usePOSStore((s) => s.updateQuantity);
  const currency = useAppStore(s => s.currency);
  const isRetail = item.itemType === 'retail';
  return (
    <div className="flex flex-col p-4 rounded-2xl bg-card border border-border group hover:border-accent hover:shadow-lg transition-all gap-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-bold text-foreground text-lg">{item.type}</div>
            <Badge variant="outline" className={cn(
              "text-[8px] uppercase px-1.5 py-0 border-none font-black",
              isRetail ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
            )}>
              {isRetail ? <Package className="h-2 w-2 mr-1" /> : <Scissors className="h-2 w-2 mr-1" />}
              {item.itemType}
            </Badge>
          </div>
          <div className="text-sm text-foreground/60 font-bold flex items-center gap-3">
            <span className="font-mono">{formatPrice(item.price, currency)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isRetail && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-full h-10 w-10"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5 rounded-2xl shadow-2xl border-border bg-card/95 backdrop-blur-sm">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">Fabric & Artistic Details</p>
                  <Input
                    placeholder="e.g. Italian Silk, French Cuff, Custom Lining..."
                    className="text-sm rounded-xl border-border focus-visible:ring-primary h-12"
                    defaultValue={item.notes}
                    onBlur={(e) => updateItem(item.id, { notes: e.target.value })}
                  />
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/20 hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10 transition-all active:scale-90"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
         <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-background text-foreground"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs font-black w-6 text-center text-foreground">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-background text-foreground"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
         </div>
         <div className="text-right">
            <p className="text-[8px] font-black uppercase text-foreground/40 tracking-widest">Line Total</p>
            <p className="font-mono font-black text-foreground">{formatPrice(item.price * item.quantity, currency)}</p>
         </div>
      </div>
    </div>
  );
}