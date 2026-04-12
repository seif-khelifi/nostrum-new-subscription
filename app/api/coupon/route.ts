import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON, type ErrorMap } from "@/lib/http";

interface CouponResult {
  description: string | null;
  id: string;
}

const COUPON_ERRORS: ErrorMap = {
  400: "Code invalide. Veuillez vérifier et réessayer.",
  401: "Session expirée. Veuillez vous reconnecter.",
  500: "Une erreur est survenue. Veuillez réessayer plus tard.",
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Code promo manquant." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  const url = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=coupon?code=eq.${encodeURIComponent(code)}`;

  try {
    const data = await fetchJSON<CouponResult[]>(
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
      },
      COUPON_ERRORS,
    );

    const coupon = data[0];
    if (!coupon?.description) {
      return NextResponse.json(
        { error: "Ce code n'est pas valide." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      description: coupon.description,
      id: coupon.id,
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    console.error("[coupon]", raw);

    // Upstream returns 200 with empty body for invalid coupon codes
    const isInvalidCode =
      raw === "Empty response body" || raw === "Invalid JSON response";

    const message = isInvalidCode
      ? "Ce code n'est pas valide."
      : raw || "Une erreur est survenue. Veuillez réessayer plus tard.";

    return NextResponse.json(
      { error: message },
      { status: isInvalidCode ? 400 : 502 },
    );
  }
}
