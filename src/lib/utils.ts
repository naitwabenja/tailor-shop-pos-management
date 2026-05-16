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
    KES: 'KSh ',
  };
  const symbol = symbols[currency] || symbols.USD;
  try {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
  } catch (error) {
    console.error('[UTILS] Price formatting failed:', error);
    return `${amount < 0 ? '-' : ''}${symbol}${Math.abs(amount).toFixed(2)}`;
  }
}