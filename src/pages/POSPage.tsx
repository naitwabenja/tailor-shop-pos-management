import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  UserPlus,
  Scissors,
  Loader2,
  Package,
  Sparkles,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { usePOSStore } from '@/store/use-pos-store';
import { useCustomers, useGarments, useInventory, useCreateGarment } from '@/hooks/use-api';
import { MeasurementForm } from '@/components/POS/MeasurementForm';
import { OrderSummary } from '@/components/POS/OrderSummary';
import { CustomerCreateDialog } from '@/components/customers/CustomerCreateDialog';
import { OrderSuccessDialog } from '@/components/POS/OrderSuccessDialog';
import { useAppStore } from '@/store/use-app-store';
import { Order } from '@shared/types';
import { toast } from 'sonner';
export default function POSPage() {
  const selectedCustomerId = usePOSStore((s) => s.selectedCustomerId);
  const setCustomer = usePOSStore((s) => s.setCustomer);
  const addItem = usePOSStore((s) => s.addItem);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [customGarmentName, setCustomGarmentName] = useState('');
  const [customGarmentPrice, setCustomGarmentPrice] = useState('');
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const currency = useAppStore(s => s.currency);
  const { data: garmentsData, isLoading: garmentsLoading } = useGarments();
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();
  const createGarment = useCreateGarment();
  const filteredCustomers = customersData?.items.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  ).slice(0, 4) || [];
  const handleAddCustomGarment = async () => {
    if (!customGarmentName || !customGarmentPrice) {
      toast.error('Please enter name and price for custom garment');
      return;
    }
    try {
      const g = await createGarment.mutateAsync({
        name: customGarmentName,
        basePrice: parseFloat(customGarmentPrice)
      });
      addItem({ 
        type: g.name, 
        price: g.basePrice, 
        itemType: 'bespoke' 
      });
      setCustomGarmentName('');
      setCustomGarmentPrice('');
      toast.success('Custom garment added to library and cart');
    } catch (e) {
      toast.error('Failed to create garment');
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden h-full">
      <div className="lg:col-span-8 flex flex-col flex-1 min-w-0 overflow-y-auto p-6 md:p-8 space-y-8 bg-background/50 custom-scrollbar">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-foreground italic">
              <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-md">
                <Search className="h-5 w-5" />
              </div>
              Select Client
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-2 border-border text-foreground bg-card hover:bg-primary hover:text-primary-foreground h-11 px-6 font-bold shadow-sm"
              onClick={() => setIsCustomerDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" /> New Customer
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-foreground/20" />
            <Input
              placeholder="Search clients by name or identification..."
              className="pl-12 h-12 rounded-xl bg-card border-2 border-border focus-visible:ring-primary shadow-lg shadow-foreground/5 text-lg font-bold placeholder:text-foreground/20 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {customersLoading ? (
            <div className="flex justify-center p-6"><Loader2 className="animate-spin text-foreground h-8 w-8" /></div>
          ) : filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => setCustomer(customer.id, customer.measurements)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2",
                    selectedCustomerId === customer.id
                      ? "bg-primary border-primary text-primary-foreground shadow-xl scale-[1.01]"
                      : "bg-card border-transparent hover:border-border shadow-sm text-foreground"
                  )}
                >
                  <div className={cn(
                    "h-11 w-11 shrink-0 rounded-lg flex items-center justify-center font-bold text-lg",
                    selectedCustomerId === customer.id ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                  )}>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-lg truncate leading-tight">{customer.name}</div>
                    <div className={cn("text-xs font-bold opacity-60", selectedCustomerId === customer.id ? "text-primary-foreground" : "text-foreground")}>
                      {customer.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-foreground/30 text-lg font-serif italic bg-foreground/5 rounded-2xl border-2 border-dashed border-border">
              Registry search returned no results.
            </div>
          )}
        </section>
        <section className="space-y-6">
          <Tabs defaultValue="garments" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-foreground italic">
                <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-md">
                  <Package className="h-5 w-5" />
                </div>
                Artisan Storefront
              </h2>
              <TabsList className="bg-card border-2 border-border h-12 rounded-xl p-1 gap-1">
                <TabsTrigger value="garments" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs px-6">Garments</TabsTrigger>
                <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs px-6">Stock</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="garments" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border-2 border-dashed border-border bg-transparent shadow-none hover:bg-foreground/5 transition-all group p-4 flex flex-col justify-between gap-4">
                   <div className="space-y-2">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">New Custom Apparel</p>
                     <Input 
                       placeholder="Item Name" 
                       className="h-9 text-xs rounded-lg"
                       value={customGarmentName}
                       onChange={(e) => setCustomGarmentName(e.target.value)}
                     />
                     <Input 
                       type="number" 
                       placeholder="Base Price" 
                       className="h-9 text-xs rounded-lg"
                       value={customGarmentPrice}
                       onChange={(e) => setCustomGarmentPrice(e.target.value)}
                     />
                   </div>
                   <Button 
                     size="sm" 
                     className="w-full font-bold h-9 rounded-lg"
                     onClick={handleAddCustomGarment}
                     disabled={createGarment.isPending}
                   >
                     {createGarment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-3 w-3 mr-2"/> Add to Library</>}
                   </Button>
                </Card>
                {garmentsLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-foreground h-10 w-10" /></div>
                ) : (
                  garmentsData?.map(type => (
                    <Card
                      key={type.id}
                      className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all border-none shadow-sm active:scale-95 duration-75 overflow-hidden group bg-card"
                      onClick={() => addItem({ type: type.name, price: type.basePrice, itemType: 'bespoke' })}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4 group-hover:bg-foreground/5 transition-colors h-full">
                        <div className="p-4 rounded-2xl bg-foreground/5 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                          <Scissors className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-foreground text-lg tracking-tight leading-tight">{type.name}</div>
                          <div className="text-sm font-serif font-bold italic text-foreground/40">From {formatPrice(type.basePrice, currency)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="inventory" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {inventoryLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-foreground h-10 w-10" /></div>
                ) : inventoryData?.filter(i => i.quantity > 0).length === 0 ? (
                   <div className="col-span-full p-10 text-center text-foreground/30 font-serif italic border-2 border-dashed rounded-2xl">Workshop stock is currently unavailable.</div>
                ) : (
                  inventoryData?.filter(i => i.quantity > 0).map(item => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all border-none shadow-sm active:scale-95 duration-75 overflow-hidden group bg-card"
                      onClick={() => addItem({ 
                        type: item.name, 
                        price: item.unitPrice, 
                        inventoryItemId: item.id, 
                        itemType: 'retail' 
                      })}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4 group-hover:bg-foreground/5 transition-colors">
                        <div className="p-4 rounded-2xl bg-foreground/5 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm relative">
                          <Package className="h-6 w-6" />
                          <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[8px] px-1 rounded font-bold">{item.quantity} {item.unit[0]}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-foreground text-lg tracking-tight leading-tight">{item.name}</div>
                          <div className="text-sm font-serif font-bold italic text-foreground/40">{formatPrice(item.unitPrice, currency)} / {item.unit}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        {selectedCustomerId && (
          <section className="space-y-6 pb-12" key={selectedCustomerId}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-foreground italic">Artisan Metrics</h2>
              <Button variant="link" size="sm" className="text-foreground font-bold p-0 text-base decoration-foreground/20">Metrics History</Button>
            </div>
            <Card className="border-none shadow-lg bg-card rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <MeasurementForm />
              </CardContent>
            </Card>
          </section>
        )}
      </div>
      <div className="lg:col-span-4 bg-card border-l border-border flex flex-col overflow-hidden shadow-xl relative z-20">
        <OrderSummary onOrderComplete={setCompletedOrder} />
      </div>
      <CustomerCreateDialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        onSuccess={(customer) => setCustomer(customer.id, customer.measurements)}
      />
      <OrderSuccessDialog
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />
    </div>
  );
}