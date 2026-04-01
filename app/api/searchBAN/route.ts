import { NextRequest, NextResponse } from "next/server";
import { fetchJSON } from "@/lib/http";
import type { GeoPFResponse } from "@/lib/geo";

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
