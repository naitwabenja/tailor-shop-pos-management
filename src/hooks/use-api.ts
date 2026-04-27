import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Customer, Order, OrderStatus, Garment } from '@shared/types';
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