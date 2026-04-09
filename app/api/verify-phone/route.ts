import { NextRequest, NextResponse } from "next/server";
import { fetchJSON, type ErrorMap } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface VerifyRequestBody {
  phone: string;
  token: string;
  type: string;
}

interface VerifyResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

/* ------------------------------------------------------------------ */
/*  Error map                                                          */
/* ------------------------------------------------------------------ */

const VERIFY_ERRORS: ErrorMap = {
  401: "Code de vérification invalide. Veuillez réessayer.",
  403: "Vous avez atteint le nombre maximum de tentatives pour entrer le code de vérification. Pour des raisons de sécurité, veuillez réessayer plus tard ou contacter notre support client pour obtenir de l'aide.",
  429: "Vous avez atteint le nombre maximum de tentatives pour entrer le code de vérification. Pour des raisons de sécurité, veuillez réessayer plus tard ou contacter notre support client pour obtenir de l'aide.",
  400: "Code de vérification invalide. Veuillez réessayer.",
  500: "Une erreur est survenue. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const VERIFY_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=verify`;
const ONE_HOUR = 60 * 60;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as VerifyRequestBody;

  try {
    const data = await fetchJSON<VerifyResult[]>(
      VERIFY_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify({
          phone: body.phone,
          token: body.token,
          type: body.type,
        }),
      },
      VERIFY_ERRORS,
    );

    const result = data[0];
    if (!result?.access_token) {
      return NextResponse.json(
        { error: "Code de vérification invalide. Veuillez réessayer." },
        { status: 502 },
      );
    }

    const { access_token } = result;

    const response = NextResponse.json({ access_token });

    response.cookies.set("accessToken", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ONE_HOUR,
      path: "/",
    });

    return response;
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    console.error("[verify-phone]", raw);

    // Upstream returns 200 with empty body for invalid OTP
    const isInvalidOtp =
      raw === "Empty response body" || raw === "Invalid JSON response";

    const message = isInvalidOtp
      ? "Code de vérification invalide. Veuillez réessayer."
      : raw || "Une erreur est survenue. Veuillez réessayer plus tard.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
