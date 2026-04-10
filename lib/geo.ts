/* ─── GeoPF API types ─── */

export interface GeoPFResult {
  x: number;
  y: number;
  kind: string;
  zipcode: string;
  city: string;
  street: string;
  fulltext: string;
  classification: number;
}

export interface GeoPFResponse {
  status: string;
  results: GeoPFResult[];
}

/* ─── Street number parsing ─── */

/** Matches a leading street number, optionally followed by bis/ter/quater. */
const STREET_NUMBER_RE = /^(\d+(?:\s*(?:bis|ter|quater))?)\s+(.+)$/i;

/**
 * Split "25 Rue Blomet" → { number: "25", street: "Rue Blomet" }.
 * If there is no leading number, `number` is "" and `street` is the full input.
 */
export function splitStreetNumber(raw: string) {
  const m = raw.match(STREET_NUMBER_RE);
  return { number: m?.[1] ?? "", street: m?.[2] ?? raw };
}

/* ─── Parsed address from fulltext ─── */

export interface ParsedAddress {
  number: string;
  street: string;
  zipcode: string;
  city: string;
}

/**
 * Parse a GeoPF fulltext like "25 Rue Blomet, 75015 Paris"
 * into structured number / street / zipcode / city fields.
 *
 * The leading digits (e.g. "25") are split into `number`,
 * and the remainder (e.g. "Rue Blomet") goes into `street`.
 */
export function parseSelectedAddress(fulltext: string): ParsedAddress | null {
  const parts = fulltext.split(",").map((p) => p.trim());
  if (parts.length < 2) return null;

  const rawStreet = parts[0];
  if (!rawStreet || rawStreet.length < 3) return null;

  const cityPart = parts[parts.length - 1].trim();
  const cityMatch = cityPart.match(/^(\d{5})\s+(.+)$/);
  if (!cityMatch) return null;

  const zipcode = cityMatch[1];
  const city = cityMatch[2].trim();
  if (!city) return null;

  const { number, street } = splitStreetNumber(rawStreet);

  return { number, street, zipcode, city };
}
