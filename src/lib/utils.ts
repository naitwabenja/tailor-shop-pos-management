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
  const absAmount = Math.abs(amount);
  try {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absAmount);
    return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
  } catch (error) {
    console.error('[UTILS] Price formatting failed:', error);
    const parts = absAmount.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const fallback = parts.join('.');
    return `${amount < 0 ? '-' : ''}${symbol}${fallback}`;
  }
}
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(timestamp));
}