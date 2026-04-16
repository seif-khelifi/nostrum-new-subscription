import optionsJson from "@/data/options.json"

/* ------------------------------------------------------------------ */
/*  Option types & data                                                */
/* ------------------------------------------------------------------ */

/** Base option shape — the fields present in data/options.json. */
export interface OptionEntry {
  id: string
  title: string
  description: string
  price: string
}

/**
 * Extended option shape used by the option-details drawer.
 * Adds an optional long description for the detail view.
 */
export interface OptionDetails extends OptionEntry {
  detailedDescription?: string
}

/** Typed cast of data/options.json — import this instead of casting in every file. */
export const optionsData = optionsJson as OptionDetails[]
