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
  }, [item]);
  const onSubmit = async (values: InventoryFormValues) => {
    try {
      await updateItem.mutateAsync({ id: item.id, ...values });
      toast.success('Inventory item updated successfully');
      form.reset();
      onOpenChange(false);
    } catch (e) {
      toast.error('Failed to update inventory item');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Edit className="h-6 w-6 text-indigo-600" />
            Edit Atelier Stock
          </DialogTitle>
          <DialogDescription>
            Update the details for this inventory item in the master stock list.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Italian Wool (Navy)" {...field} className="rounded-xl" />
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="meters, pcs, packs" {...field} className="rounded-xl" />
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
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-xl"
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
                    <FormLabel>Unit Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-xl"
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
                  <FormLabel>Low Stock Warning Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className="rounded-xl"
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
                  <FormLabel>Supplier/Design Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Sourced from Lagos Market..." {...field} className="rounded-xl resize-none h-20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-bold"
                disabled={updateItem.isPending}
              >
                {updateItem.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Update Stock Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}