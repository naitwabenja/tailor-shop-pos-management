import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Customer, Order, OrderStatus, Garment, InventoryItem, MeasurementRecord } from '@shared/types';
export function useCustomers(cursor?: string, limit?: number) {
  return useQuery({
    queryKey: ['customers', cursor, limit],
    queryFn: () => api<{ items: Customer[]; next: string | null }>(`/api/customers?${new URLSearchParams({
      ...(cursor && { cursor }),
      ...(limit && { limit: limit.toString() })
    })}`),
  });
}
export function useGarments() {
  return useQuery({
    queryKey: ['garments'],
    queryFn: () => api<Garment[]>('/api/garments'),
  });
}
export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => api<InventoryItem[]>('/api/inventory'),
  });
}
export function useMeasurementHistory() {
  return useQuery({
    queryKey: ['measurements'],
    queryFn: () => api<MeasurementRecord[]>('/api/measurements'),
  });
}
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => api<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
export function useImportMeasurements() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any[]) => api<{ success: number; failed: number; errors: string[] }>('/api/measurements/import', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<InventoryItem>) => api<InventoryItem>('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<InventoryItem>) => api<InventoryItem>(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ id: string; deleted: boolean }>(`/api/inventory/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
export function useOrders(cursor?: string, limit?: number) {
  return useQuery({
    queryKey: ['orders', cursor, limit],
    queryFn: () => api<{ items: Order[]; next: string | null }>(`/api/orders?${new URLSearchParams({
      ...(cursor && { cursor }),
      ...(limit && { limit: limit.toString() })
    })}`),
  });
}
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Order>) => api<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api<Order>(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}