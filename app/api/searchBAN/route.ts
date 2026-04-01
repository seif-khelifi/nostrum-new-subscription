import { NextRequest, NextResponse } from "next/server";
import { fetchJSON } from "@/lib/http";
import type { GeoPFResponse } from "@/lib/geo";

/**
 * The GeoPF server uses a Certigna root CA that is missing from many
 * Linux CA bundles and from Node's built-in store.
 * Disable TLS verification for outgoing requests from this server process.
 * TODO: install the Certigna root CA on the host and remove this workaround.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const GEOPF_URL = "https://data.geopf.fr/geocodage/completion/";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text") ?? "";
  if (text.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    text,
    type: "StreetAddress",
    maximumResponses: "8",
  });

  const postalMatch = text.match(/\b\d{5}\b/);
  if (postalMatch) {
    params.set("terr", postalMatch[0]);
  }

  const data = await fetchJSON<GeoPFResponse>(
    `${GEOPF_URL}?${params.toString()}`,
  );

  return NextResponse.json({ results: data.results ?? [] });
}
