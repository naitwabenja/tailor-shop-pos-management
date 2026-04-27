import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  ShoppingCart,
  Trash2,
  UserPlus,
  CreditCard,
  ChevronRight,
  Scissors
} from 'lucide-react';
import { MOCK_CUSTOMERS, MOCK_GARMENT_TYPES } from '@shared/mock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export default function POSPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const addToCart = (type: string, price: number) => {
    setCart([...cart, { id: Math.random().toString(), type, price }]);
    toast.success(`Added ${type} to order`);
  };
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  return (
    <AppLayout fullBleed contentClassName="flex flex-col h-[calc(100vh-theme(spacing.14))] lg:h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden h-full">
        {/* Left Side: Order Configuration */}
        <div className="lg:col-span-8 flex flex-col overflow-y-auto p-6 space-y-8 bg-slate-50 dark:bg-slate-950">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-600" />
                Customer Selection
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <UserPlus className="h-4 w-4" /> New Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Quick Add Customer</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="555-0000" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => toast.success("Customer added locally")}>Create Profile</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or phone..."
                className="pl-10 h-12 rounded-xl bg-white shadow-sm border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 4).map(customer => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2",
                    selectedCustomer?.id === customer.id
                      ? "bg-indigo-50 border-indigo-600 shadow-md"
                      : "bg-white border-transparent hover:border-indigo-200 shadow-sm"
                  )}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-xs text-slate-500">{customer.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Scissors className="h-5 w-5 text-indigo-600" />
              Select Garments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_GARMENT_TYPES.map(type => (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-none shadow-sm active:scale-95 duration-75 overflow-hidden group"
                  onClick={() => addToCart(type.name, type.basePrice)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-2 group-hover:bg-indigo-50 transition-colors">
                    <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="font-bold text-slate-900">{type.name}</div>
                    <div className="text-sm font-medium text-slate-500">From ${type.basePrice}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          {selectedCustomer && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Quick Measurements</h2>
                <Button variant="link" className="text-indigo-600 font-semibold p-0">View All History</Button>
              </div>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(selectedCustomer.measurements).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400 tracking-wider">{key}</Label>
                        <Input
                          defaultValue={val}
                          className="font-bold text-lg border-none bg-slate-50 text-slate-900 focus-visible:ring-1 focus-visible:ring-indigo-600"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold">Order Summary</h2>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <div className="p-4 rounded-full bg-slate-50">
                    <ShoppingCart className="h-12 w-12" />
                  </div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 group hover:bg-slate-100 transition-colors">
                    <div>
                      <div className="font-semibold text-slate-900">{item.type}</div>
                      <div className="text-sm text-indigo-600 font-medium">${item.price}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span className="font-medium">${total}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 text-sm">
                <span>Tax (Mock 5%)</span>
                <span className="font-medium">${(total * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-2xl font-bold text-slate-900">
                <span>Total</span>
                <span>${(total * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-950/50">
            <Button
              className="w-full h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none gap-3"
              disabled={cart.length === 0}
              onClick={() => toast.success("Order processed successfully")}
            >
              <CreditCard className="h-6 w-6" />
              Process Payment
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}