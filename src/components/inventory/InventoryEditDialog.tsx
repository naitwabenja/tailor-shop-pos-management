import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit } from 'lucide-react';
import { useUpdateInventoryItem } from '@/hooks/use-api';
import { toast } from 'sonner';
import { InventoryItem } from '@shared/types';
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(['Fabric', 'Garment', 'Supply']),
  quantity: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().min(0),
  lowStockThreshold: z.number().min(0),
  notes: z.string().optional(),
});
type InventoryFormValues = z.infer<typeof formSchema>;
interface InventoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
}
export function InventoryEditDialog({ open, onOpenChange, item }: InventoryEditDialogProps) {
  const updateItem = useUpdateInventoryItem();
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      lowStockThreshold: item.lowStockThreshold,
      notes: item.notes || "",
    },
  });
  useEffect(() => {
    form.reset({
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      lowStockThreshold: item.lowStockThreshold,
      notes: item.notes || "",
    });
  }, [item, form]); // Included form in dependency array to resolve lint warning
  const onSubmit = async (values: InventoryFormValues) => {
    try {
      await updateItem.mutateAsync({ id: item.id, ...values });
      toast.success('Atelier stock updated');
      form.reset();
      onOpenChange(false);
    } catch (e) {
      toast.error('Failed to update inventory item');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-brown/10 text-brand-brown flex items-center justify-center">
              <Edit className="h-5 w-5" />
            </div>
            Update Stock Item
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Refine the details for this workshop material in the master inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Item Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Italian Wool (Navy)" {...field} className="rounded-xl h-12 bg-background/50 border-border/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Registry Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-12 bg-background/50 border-border/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border/50">
                        <SelectItem value="Fabric">Fabric</SelectItem>
                        <SelectItem value="Garment">Garment</SelectItem>
                        <SelectItem value="Supply">Supply</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Measure Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="meters, pcs, packs" {...field} className="rounded-xl h-12 bg-background/50 border-border/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Stock Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-xl h-12 bg-background/50 border-border/50 font-mono font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Acquisition Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-xl h-12 bg-background/50 border-border/50 font-mono font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Alert Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className="rounded-xl h-12 bg-background/50 border-border/50 font-mono font-bold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Artisan Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Sourced from preferred supplier..." {...field} className="rounded-xl resize-none h-24 bg-background/50 border-border/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-6">
              <Button
                type="submit"
                className="w-full h-14 bg-brand-brown hover:bg-brand-green rounded-2xl text-lg font-bold shadow-xl shadow-brand-brown/10 transition-all"
                disabled={updateItem.isPending}
              >
                {updateItem.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Update Workshop Registry"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}