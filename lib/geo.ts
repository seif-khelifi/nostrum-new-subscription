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

/* ─── Parsed address from fulltext ─── */

export interface ParsedAddress {
  street: string;
  zipcode: string;
  city: string;
}

/**
 * Parse a GeoPF fulltext like "12 Rue de Rivoli, 75001 Paris"
 * into structured street / zipcode / city fields.
 */
export function parseSelectedAddress(fulltext: string): ParsedAddress | null {
  const parts = fulltext.split(",").map((p) => p.trim());
  if (parts.length < 2) return null;

  const street = parts[0];
  if (!street || street.length < 3) return null;

  const cityPart = parts[parts.length - 1].trim();
  const cityMatch = cityPart.match(/^(\d{5})\s+(.+)$/);
  if (!cityMatch) return null;

  const zipcode = cityMatch[1];
  const city = cityMatch[2].trim();
  if (!city) return null;

  return { street, zipcode, city };
}
