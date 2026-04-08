import { NextRequest, NextResponse } from "next/server";
import { fetchJSON } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PricingRequestBody {
  beneficiaries: { birthdate: string; relationship: string }[];
  productId?: string;
  startDate: string;
  selectedPlan: number;
}

interface PricingResult {
  price: string;
  success: string;
  id: string;
  total_price_by_period: string[];
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const PRICING_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=product-pricing-v3`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PricingRequestBody;

  const requestBody = {
    beneficiaries: body.beneficiaries.map(({ birthdate, relationship }) => ({
      birthdate,
      relationship,
    })),
    productId: body.productId,
    startDate: body.startDate,
    selectedPlan: body.selectedPlan,
  };

  try {
    const data = await fetchJSON<PricingResult[]>(PRICING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[pricing]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
