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
    // Fallback for environments where Intl might fail or behave unexpectedly
    const fallback = Math.abs(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `${amount < 0 ? '-' : ''}${symbol}${fallback}`;
  }
}