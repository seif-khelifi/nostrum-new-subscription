import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { InsuranceItem, InsuranceSearchResult } from "@/components/ui/search-input"

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

/* ═══════════════════════════════════════════════════════════════════ */
/*  Contract-swap date helpers                                        */
/* ═══════════════════════════════════════════════════════════════════ */

export interface SwapDates {
  /** Last day of M+1 (the old contract's last coverage day), DD/MM/YYYY */
  previousHealthMutualLastDay: string
  /** First day of M+2 (Nostrum coverage start), DD/MM/YYYY */
  secondNextMonthFirstDay: string
  /** Whether the computed start date falls in the next calendar year */
  contractStartsNextYear: boolean
}

/**
 * Compute the two key dates for the insurance-swap scenario (résiliation / RIA):
 *
 * - `previousHealthMutualLastDay`: last day of M+1 (the month after the current month)
 * - `secondNextMonthFirstDay`: 1st day of M+2
 *
 * Handles year wraparound (e.g. November → January of next year).
 */
export function calculateDatesOfContractsSwap(now: Date = new Date()): SwapDates {
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-indexed

  // M+2 first day
  let m2Month = currentMonth + 2
  let m2Year = currentYear
  if (m2Month > 11) {
    m2Month -= 12
    m2Year += 1
  }
  const secondNextMonthFirst = new Date(m2Year, m2Month, 1)

  // Last day of M+1 = day before the 1st of M+2
  const previousHealthMutualLast = new Date(m2Year, m2Month, 0) // day 0 of M+2 = last day of M+1

  const contractStartsNextYear = m2Year > currentYear

  return {
    previousHealthMutualLastDay: formatBirthdate(previousHealthMutualLast),
    secondNextMonthFirstDay: formatBirthdate(secondNextMonthFirst),
    contractStartsNextYear,
  }
}

/** Resolve an insurance name to a known item or a custom name. */
export function resolveInitialSelection(
  name: string | undefined,
  list: InsuranceItem[],
): InsuranceSearchResult {
  if (!name) return { item: null, customName: null }
  const found = list.find((m) => m.name === name) ?? null
  return found
    ? { item: found, customName: null }
    : { item: null, customName: name }
}
