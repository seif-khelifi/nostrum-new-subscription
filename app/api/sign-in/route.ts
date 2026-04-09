import { NextRequest, NextResponse } from "next/server";
import { fetchJSON, type ErrorMap } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SignInRequestBody {
  phone: string;
}

interface SignInResponse {
  status: number;
  data: {
    body: { message_id: string };
    headers: Record<string, unknown>;
    statusCode: number;
    statusMessage: string;
  }[];
}

/* ------------------------------------------------------------------ */
/*  Error map                                                          */
/* ------------------------------------------------------------------ */

const SIGN_IN_ERRORS: ErrorMap = {
  429: "Vous avez atteint le nombre maximum de tentatives pour entrer le code de vérification. Pour des raisons de sécurité, veuillez réessayer plus tard ou contacter notre support client pour obtenir de l'aide.",
  403: "Vous avez atteint le nombre maximum de tentatives pour entrer le code de vérification. Pour des raisons de sécurité, veuillez réessayer plus tard ou contacter notre support client pour obtenir de l'aide.",
  400: "Numéro de téléphone invalide. Veuillez vérifier et réessayer.",
  500: "Une erreur est survenue. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const SIGN_IN_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=signin`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SignInRequestBody;

  try {
    const data = await fetchJSON<SignInResponse>(
      SIGN_IN_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify({ phone: body.phone }),
      },
      SIGN_IN_ERRORS,
    );

    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue. Veuillez réessayer plus tard.";
    console.error("[sign-in]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
