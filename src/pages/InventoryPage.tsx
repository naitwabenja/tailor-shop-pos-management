import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInventory, useUpdateInventoryItem, useDeleteInventoryItem } from '@/hooks/use-api';
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
  Warehouse,
  Edit,
  Trash2
} from 'lucide-react';
import { InventoryItem } from '@shared/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { InventoryEditDialog } from '@/components/inventory/InventoryEditDialog';
export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<InventoryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const currency = useAppStore((s) => s.currency);
  const { data: inventory, isLoading } = useInventory();
  const updateInventoryItem = useUpdateInventoryItem();
  const deleteInventoryItem = useDeleteInventoryItem();
  const filteredItems = inventory?.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const criticalCount = inventory?.filter(i => i.quantity <= i.lowStockThreshold).length || 0;
  const handleQuickRestock = async (id: string, current: number, itemName: string, itemUnit: string) => {
    try {
      await updateInventoryItem.mutateAsync({ id, quantity: current + 10 });
      toast.success(`Restocked ${itemName}: +10 ${itemUnit}`);
    } catch (e) {
      toast.error('Failed to update stock');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-brown tracking-tight">Atelier Inventory</h1>
            <p className="text-xs text-brand-brown/60 font-bold">Tracking fabrics and workshop supplies</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-brand-brown/30" />
              <Input
                placeholder="Search stock..."
                className="pl-9 h-9 rounded-lg bg-white/50 border-brand-brown/10 focus-visible:ring-brand-brown text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              className="bg-brand-brown hover:bg-brand-green h-9 rounded-lg gap-2 font-bold shadow-md shadow-brand-brown/10 text-xs"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Add Stock
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-none shadow-sm bg-brand-green/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-brand-green">Supplies</p>
                  <h3 className="text-2xl font-serif font-bold text-brand-brown">{inventory?.length || 0}</h3>
                </div>
                <Warehouse className="h-6 w-6 text-brand-green/20" />
              </div>
            </CardContent>
          </Card>
          <Card className={cn("border-none shadow-sm", criticalCount > 0 ? "bg-red-50/50" : "bg-brand-brown/5")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-[9px] uppercase font-bold tracking-widest", criticalCount > 0 ? "text-red-600" : "text-brand-brown/40")}>Low Stock</p>
                  <h3 className="text-2xl font-serif font-bold text-brand-brown">{criticalCount}</h3>
                </div>
                <AlertCircle className={cn("h-6 w-6", criticalCount > 0 ? "text-red-200" : "text-brand-brown/20")} />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-none shadow-sm overflow-hidden bg-white/40 backdrop-blur-sm">
          <CardHeader className="bg-brand-brown/5 border-b border-brand-brown/10 px-6 py-4">
            <CardTitle className="text-base font-serif font-bold text-brand-brown">Master Stock List</CardTitle>
            <CardDescription className="text-[10px] text-brand-brown/40 font-bold italic">Real-time availability</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-brown h-6 w-6" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-white/50 text-brand-brown/40 font-bold uppercase tracking-widest text-[9px]">
                    <tr>
                      <th className="px-6 py-3 text-left">Item</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-brown/5">
                    {filteredItems.map((item) => {
                      const isCritical = item.quantity <= item.lowStockThreshold;
                      return (
                        <tr key={item.id} className="hover:bg-brand-brown/5 transition-colors group">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center font-bold",
                                isCritical ? "bg-red-50 text-red-600" : "bg-brand-brown/10 text-brand-brown"
                              )}>
                                <Package className="h-4 w-4" />
                              </div>
                              <p className="font-bold text-brand-brown truncate max-w-[120px]">{item.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="rounded-md font-bold text-[8px] uppercase tracking-tight border-brand-brown/10 text-brand-brown/60 px-1 py-0">
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-brand-brown">
                            {item.quantity}<span className="text-[9px] font-normal text-brand-brown/40 ml-0.5">{item.unit[0]}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-brand-brown/50">
                            {formatPrice(item.unitPrice, currency)}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[10px] font-bold text-brand-brown/60 hover:bg-brand-brown/5 px-2"
                                onClick={() => handleQuickRestock(item.id, item.quantity, item.name, item.unit)}
                              >
                                +10
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                                    <MoreVertical className="h-3.5 w-3.5 text-brand-brown/20" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-brand-brown/10">
                                  <DropdownMenuItem onClick={() => { setEditItem({ ...item }); setIsEditOpen(true); }} className="font-bold text-brand-brown text-xs">
                                    <Edit className="mr-2 h-3 w-3" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => { setPendingDeleteItem(item); setShowDeleteConfirm(true); }} className="text-red-600 font-bold text-xs">
                                    <Trash2 className="mr-2 h-3 w-3" /> Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
      {editItem && <InventoryEditDialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditItem(null); }} item={editItem} />}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif font-bold text-brand-brown text-xl">Archive Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-brand-brown/60">
              Archiving "{pendingDeleteItem?.name}" will remove it from active stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-brand-brown/10 text-brand-brown font-bold text-xs h-10" onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl font-bold text-xs h-10" onClick={async () => {
              if (pendingDeleteItem) await deleteInventoryItem.mutateAsync(pendingDeleteItem.id);
              setShowDeleteConfirm(false);
            }}>Confirm Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}