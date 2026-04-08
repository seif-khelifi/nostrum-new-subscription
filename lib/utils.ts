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

/** Format a Date to DD/MM/YYYY (the format expected by the Nostrum API). */
export function formatBirthdate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

/** Parse a DD/MM/YYYY string back into a Date. Also handles ISO strings for backwards compat. */
export function parseBirthdate(value: string): Date | undefined {
  if (!value) return undefined
  // DD/MM/YYYY
  const parts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (parts) return new Date(+parts[3], +parts[2] - 1, +parts[1])
  // ISO or any other format Date can parse
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}
