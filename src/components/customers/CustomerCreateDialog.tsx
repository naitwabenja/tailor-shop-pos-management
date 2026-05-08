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
import { Loader2, UserPlus } from 'lucide-react';
import { useCreateCustomer } from '@/hooks/use-api';
import { toast } from 'sonner';
import { Customer } from '@shared/types';
const formSchema = z.object({
  name: z.string().min(2, "Designation is too short"),
  phone: z.string().min(5, "Contact identifier invalid"),
  email: z.string().email("Invalid digital address").optional().or(z.literal("")),
});
interface CustomerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (customer: Customer) => void;
}
export function CustomerCreateDialog({ open, onOpenChange, onSuccess }: CustomerCreateDialogProps) {
  const createCustomer = useCreateCustomer();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const customer = await createCustomer.mutateAsync({
        ...values,
        measurements: {},
      });
      toast.success("Artisan profile registered successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.(customer);
    } catch (e) {
      toast.error("Failed to formalize registry entry");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-brand-brown h-2 w-full" />
        <div className="p-10 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold flex items-center gap-4 text-brand-brown italic">
              <div className="h-12 w-12 rounded-2xl bg-brand-brown/10 text-brand-brown flex items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              Register Client
            </DialogTitle>
            <DialogDescription className="text-brand-brown/60 font-medium">
              Create a formal artisan profile for tracking client commissions and metrics.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Full Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Master Artisan Client" {...field} className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm focus-visible:ring-brand-brown" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Contact Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="+254 000 000 000" {...field} className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm focus-visible:ring-brand-brown" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-brown/40 ml-1">Digital Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="artisan.client@domain.com" {...field} className="rounded-2xl h-12 bg-white/50 border-brand-brown/10 shadow-sm focus-visible:ring-brand-brown" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-16 bg-brand-brown hover:bg-brand-green text-white rounded-2xl text-lg font-bold shadow-xl shadow-brand-brown/20 transition-all active:scale-95"
                  disabled={createCustomer.isPending}
                >
                  {createCustomer.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Formalize Profile"
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