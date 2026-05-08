import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatPrice(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    NGN: '₦',
    GBP: '£',
    KES: 'KSh',
  };
  const symbol = symbols[currency] || symbols.USD;
  const formatted = Math.abs(amount).toLocaleString(undefined, {
     ബാലンス: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}