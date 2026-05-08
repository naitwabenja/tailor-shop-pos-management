import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInventory, useUpdateInventoryItem } from '@/hooks/use-api';
import { useAppStore } from '@/store/use-app-store';
import { formatPrice } from '@/lib/utils';
import { InventoryCreateDialog } from '@/components/inventory/InventoryCreateDialog';
import {
  Package,
  Search,
  Plus,
  AlertCircle,
  MoreVertical,
  Loader2,
  Box,
  Warehouse
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const currency = useAppStore((s) => s.currency);
  const { data: inventory, isLoading } = useInventory();
  const updateStock = useUpdateInventoryItem();
  const filteredItems = inventory?.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const criticalCount = inventory?.filter(i => i.quantity <= i.lowStockThreshold).length || 0;
  const lowCount = inventory?.filter(i => i.quantity > i.lowStockThreshold && i.quantity < i.lowStockThreshold * 2).length || 0;
  const handleQuickRestock = async (id: string, current: number) => {
    try {
      await updateStock.mutateAsync({ id, quantity: current + 10 });
      toast.success(`Inventory updated: ${formatPrice(10, currency)} worth added to stock`);
    } catch (e) {
      toast.error('Failed to update stock');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Atelier Inventory</h1>
            <p className="text-slate-500">Track fabrics, notions, and workshop supplies for LEAfrique</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search stock..."
                className="pl-9 h-10 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 h-10 rounded-xl gap-2 font-bold shadow-lg shadow-indigo-100"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-none shadow-soft bg-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Total Items</p>
                  <h3 className="text-3xl font-extrabold text-slate-900">{inventory?.length || 0}</h3>
                </div>
                <Warehouse className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          <Card className={cn("border-none shadow-soft", lowCount > 0 ? "bg-amber-50/50" : "bg-slate-50/50")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-[10px] uppercase font-bold tracking-widest", lowCount > 0 ? "text-amber-600" : "text-slate-400")}>Low Stock</p>
                  <h3 className="text-3xl font-extrabold text-slate-900">{lowCount}</h3>
                </div>
                <Box className={cn("h-8 w-8", lowCount > 0 ? "text-amber-200" : "text-slate-200")} />
              </div>
            </CardContent>
          </Card>
          <Card className={cn("border-none shadow-soft", criticalCount > 0 ? "bg-red-50/50 animate-pulse" : "bg-slate-50/50")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-[10px] uppercase font-bold tracking-widest", criticalCount > 0 ? "text-red-600" : "text-slate-400")}>Critical</p>
                  <h3 className="text-3xl font-extrabold text-slate-900">{criticalCount}</h3>
                </div>
                <AlertCircle className={cn("h-8 w-8", criticalCount > 0 ? "text-red-200" : "text-slate-200")} />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold">Master Stock List</CardTitle>
            <CardDescription>Real-time availability across LEAfrique workshops</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <tr>
                      <th className="px-6 py-4 text-left">Item Details</th>
                      <th className="px-4 py-4 text-left">Category</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4 text-right">Quantity</th>
                      <th className="px-4 py-4 text-right">Price/Unit</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isCritical = item.quantity <= item.lowStockThreshold;
                      const isLow = item.quantity < item.lowStockThreshold * 2;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center font-bold transition-colors",
                                isCritical ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                              )}>
                                <Package className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-400">Ref: {item.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="rounded-lg font-bold text-[10px] uppercase tracking-wider border-slate-200">
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {isCritical ? (
                              <Badge className="bg-red-100 text-red-700 border-none rounded-full px-3">Critical</Badge>
                            ) : isLow ? (
                              <Badge className="bg-amber-100 text-amber-700 border-none rounded-full px-3">Low Stock</Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-700 border-none rounded-full px-3">Stable</Badge>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right font-mono font-bold">
                            {item.quantity} <span className="text-[10px] font-normal text-slate-400 ml-1">{item.unit}</span>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-slate-500">
                            {formatPrice(item.unitPrice, currency)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-lg font-bold text-indigo-600 hover:bg-indigo-50"
                                onClick={() => handleQuickRestock(item.id, item.quantity)}
                                disabled={updateStock.isPending}
                              >
                                +10
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <InventoryCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}