import { NextRequest, NextResponse } from "next/server";
import { fetchJSON, type ErrorMap } from "@/lib/http";
import type { GeoPFResponse } from "@/lib/geo";

const GEOPF_ERRORS: ErrorMap = {
  400: "Invalid search query (missing text or bad type parameter)",
  403: "GeoPF access denied (referer blocked or service restricted)",
  404: "GeoPF endpoint not found (bad URL)",
  429: "GeoPF rate limited (exceeded 10 req/s)",
  500: "GeoPF server error",
  503: "GeoPF unavailable (maintenance)",
};

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

  try {
    const data = await fetchJSON<GeoPFResponse>(
      `${GEOPF_URL}?${params.toString()}`,
      {},
      GEOPF_ERRORS,
    );

    return NextResponse.json({ results: data.results ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
