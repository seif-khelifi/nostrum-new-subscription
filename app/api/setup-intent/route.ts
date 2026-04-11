import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError, fetchJSON, type ErrorMap } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Error map                                                          */
/* ------------------------------------------------------------------ */

const SETUP_INTENT_ERRORS: ErrorMap = {
  400: "Requête de paiement invalide. Veuillez réessayer.",
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Action non autorisée.",
  500: "Une erreur est survenue. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const SETUP_INTENT_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=stripe/setup-intent`;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  if (!token) {
    return NextResponse.json(
      { error: "Session expirée. Veuillez vous reconnecter." },
      { status: 401 },
    );
  }

  const body: unknown = await req.json();

  try {
    const data = await fetchJSON<unknown>(
      SETUP_INTENT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify(body),
      },
      SETUP_INTENT_ERRORS,
    );

    return NextResponse.json({
      message: "Successful request.",
      data,
    });
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer plus tard.";
    console.error("[setup-intent]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
