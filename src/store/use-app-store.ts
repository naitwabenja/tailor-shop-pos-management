import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
export type CurrencyCode = 'USD' | 'EUR' | 'NGN' | 'GBP';
interface User {
  id: string;
  email: string;
  name: string;
}
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currency: CurrencyCode;
}
interface AppActions {
  login: (email: string) => void;
  logout: () => void;
  setCurrency: (currency: CurrencyCode) => void;
}
export const useAppStore = create<AppState & AppActions>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      currency: 'USD',
      login: (email) =>
        set((state) => {
          state.user = { id: '1', email, name: 'Lead Tailor' };
          state.isAuthenticated = true;
        }),
      logout: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
        }),
      setCurrency: (currency) =>
        set((state) => {
          state.currency = currency;
        }),
    })),
    {
      name: 'leafrique-app-storage',
    }
  )
);