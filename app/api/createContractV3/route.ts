import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON, type ErrorMap } from "@/lib/http";
import type { VitaSessionStorage } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface CreateContractRequestBody {
  session: VitaSessionStorage;
  coupon?: { code: string; id: string };
}

interface CreateContractResponseItem {
  rk_OneSpanContractURL: string;
  id: string;
}

/* ------------------------------------------------------------------ */
/*  Error map                                                         */
/* ------------------------------------------------------------------ */

const CREATE_CONTRACT_ERRORS: ErrorMap = {
  400: "Données invalides. Veuillez vérifier vos informations.",
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Action non autorisée.",
  500: "Une erreur est survenue lors de la création du contrat. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */

const CREATE_CONTRACT_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=contract`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateContractRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  try {
    const data = await fetchJSON<CreateContractResponseItem[]>(
      CREATE_CONTRACT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify(body),
      },
      CREATE_CONTRACT_ERRORS,
    );

    const first = data?.[0];
    if (!first?.id || !first?.rk_OneSpanContractURL) {
      return NextResponse.json(
        { error: "Réponse invalide lors de la création du contrat." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      id: first.id,
      rk_OneSpanContractURL: first.rk_OneSpanContractURL,
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue lors de la création du contrat. Veuillez réessayer plus tard.";
    console.error("[createContractV3]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
