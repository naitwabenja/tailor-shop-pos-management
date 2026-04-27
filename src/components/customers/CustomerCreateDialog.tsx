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
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(5, "Invalid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
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
      toast.success("Customer profile created");
      form.reset();
      onOpenChange(false);
      onSuccess?.(customer);
    } catch (e) {
      toast.error("Failed to create customer");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            New Client Profile
          </DialogTitle>
          <DialogDescription>
            Enter the client details to start their bespoke journey.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Johnathan Doe" {...field} className="rounded-xl h-11" />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} className="rounded-xl h-11" />
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-bold"
                disabled={createCustomer.isPending}
              >
                {createCustomer.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Profile"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}