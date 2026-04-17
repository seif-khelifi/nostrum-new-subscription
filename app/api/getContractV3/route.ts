import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON, type ErrorMap } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface ContractRow {
  id: string;
  status: string;
  onboarding_status: string;
  onespan_id: string;
  [key: string]: unknown;
}

interface GetContractRequestBody {
  id: string;
}

/* ------------------------------------------------------------------ */
/*  Error map                                                         */
/* ------------------------------------------------------------------ */

const GET_CONTRACT_ERRORS: ErrorMap = {
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Action non autorisée.",
  404: "Contrat introuvable.",
  500: "Une erreur est survenue lors de la récupération du contrat. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */

/**
 * Upstream: V3 proxy — POST /proxy?route=contract&id=eq.{id}
 * PostgREST-style filter: `id=eq.{contractId}` returns the single row.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as GetContractRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  if (!body.id) {
    return NextResponse.json(
      { error: "Identifiant de contrat manquant." },
      { status: 400 },
    );
  }

  const contractId = body.id;
  const directUrl = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=contract&id=eq.${contractId}`;

  try {
    const data = await fetchJSON<ContractRow[]>(
      directUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
          Prefer: "count=none",
        },
      },
      GET_CONTRACT_ERRORS,
    );

    const contract = data?.[0];
    if (!contract) {
      return NextResponse.json(
        { error: "Contrat introuvable." },
        { status: 502 },
      );
    }

    return NextResponse.json({ contract });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue lors de la récupération du contrat. Veuillez réessayer plus tard.";
    console.error("[getContractV3]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
