import React from 'react';
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
import { Loader2, PackagePlus } from 'lucide-react';
import { useCreateInventoryItem } from '@/hooks/use-api';
import { toast } from 'sonner';
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
interface InventoryCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function InventoryCreateDialog({ open, onOpenChange }: InventoryCreateDialogProps) {
  const createItem = useCreateInventoryItem();
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Fabric",
      quantity: 0,
      unit: "meters",
      unitPrice: 0,
      lowStockThreshold: 5,
      notes: "",
    },
  });
  const onSubmit = async (values: InventoryFormValues) => {
    try {
      await createItem.mutateAsync(values);
      toast.success("Stock item secured in workshop");
      form.reset();
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to register inventory item");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-brand-brown h-2 w-full" />
        <div className="p-10 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold flex items-center gap-4 text-brand-brown italic">
              <div className="h-12 w-12 rounded-2xl bg-brand-brown/10 text-brand-brown flex items-center justify-center shadow-sm">
                <PackagePlus className="h-6 w-6" />
              </div>
              Stock Registry
            </DialogTitle>
            <DialogDescription className="text-brand-brown/60 font-medium">
              Register new atelier supplies or fabrics into the workshop database.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Item Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Italian Wool (Navy)" {...field} className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 focus-visible:ring-brand-brown shadow-sm" />
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
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-brand-brown/10">
                          <SelectItem value="Fabric" className="font-bold">Fabric</SelectItem>
                          <SelectItem value="Garment" className="font-bold">Garment</SelectItem>
                          <SelectItem value="Supply" className="font-bold">Supply</SelectItem>
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
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Registry Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="meters, pcs, packs" {...field} className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm" />
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
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Opening Volume</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm font-mono font-bold"
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
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Acquisition Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm font-mono font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Supplier / Artisan Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details on sourcing or special characteristics..." {...field} className="rounded-2xl resize-none h-24 bg-white/50 border-brand-brown/10 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-16 bg-brand-brown hover:bg-brand-green rounded-2xl text-lg font-bold text-white shadow-xl shadow-brand-brown/20 transition-all active:scale-95"
                  disabled={createItem.isPending}
                >
                  {createItem.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Formalize Registry Entry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}