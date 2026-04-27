import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GarmentItem, Measurements } from '@shared/types';
interface POSState {
  items: GarmentItem[];
  selectedCustomerId: string | null;
  draftMeasurements: Measurements;
}
interface POSActions {
  addItem: (item: Omit<GarmentItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<GarmentItem>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCustomer: (customerId: string | null, measurements?: Measurements) => void;
  updateDraftMeasurement: (field: string, value: number) => void;
  clearCart: () => void;
}
export const usePOSStore = create<POSState & POSActions>()(
  immer((set) => ({
    items: [],
    selectedCustomerId: null,
    draftMeasurements: {},
    addItem: (item) =>
      set((state) => {
        state.items.push({ 
          ...item, 
          id: crypto.randomUUID(), 
          quantity: 1 
        });
      }),
    removeItem: (id) =>
      set((state) => {
        state.items = state.items.filter((i) => i.id !== id);
      }),
    updateItem: (id, updates) =>
      set((state) => {
        const index = state.items.findIndex((i) => i.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updates };
        }
      }),
    updateQuantity: (id, quantity) =>
      set((state) => {
        const index = state.items.findIndex((i) => i.id === id);
        if (index !== -1) {
          state.items[index].quantity = Math.max(1, quantity);
        }
      }),
    setCustomer: (customerId, measurements) =>
      set((state) => {
        state.selectedCustomerId = customerId;
        if (measurements) {
          state.draftMeasurements = measurements;
        } else {
          state.draftMeasurements = {};
        }
      }),
    updateDraftMeasurement: (field, value) =>
      set((state) => {
        state.draftMeasurements[field] = value;
      }),
    clearCart: () =>
      set((state) => {
        state.items = [];
        state.selectedCustomerId = null;
        state.draftMeasurements = {};
      }),
  }))
);