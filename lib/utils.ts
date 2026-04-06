import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Capitalize the first letter of a string. */
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Parse a French-formatted price string (e.g. "54,23€") to a number. */
export function parsePrice(priceStr: string): number {
  const numStr = priceStr.replace("€", "").replace(",", ".").trim()
  return parseFloat(numStr) || 0
}

/** Format a number to a French price string (e.g. "54,23€"). */
export function formatPriceLabel(priceNum: number): string {
  return priceNum.toFixed(2).replace(".", ",") + "€"
}
