import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON, type ErrorMap } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface CreateBeneficiariesRequestBody {
  beneficiaries: any[];
  user_id: string;
}

interface CreateBeneficiariesResponse {
  beneficiaryIds: string[];
}

/* ------------------------------------------------------------------ */
/*  Error map                                                         */
/* ------------------------------------------------------------------ */

const CREATE_BENEFICIARIES_ERRORS: ErrorMap = {
  400: "Données invalides. Veuillez vérifier les informations des bénéficiaires.",
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Action non autorisée.",
  500: "Une erreur est survenue lors de la création des bénéficiaires. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */

const CREATE_BENEFICIARIES_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=beneficiaries`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateBeneficiariesRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  // Debug: print the beneficiaries to see what dates are empty
  console.log("[createBeneficiariesV3] Received beneficiaries:", JSON.stringify(body.beneficiaries, null, 2));
  
  // Check for empty dates
  body.beneficiaries.forEach((b, i) => {
    Object.keys(b).forEach(key => {
      if ((key.toLowerCase().includes('date') || key.toLowerCase().includes('birth')) && (b as any)[key] === "") {
        console.error(`[createBeneficiariesV3] Empty date field at beneficiary ${i}: ${key}`);
      }
    });
  });

  try {
    const data = await fetchJSON<any[]>(
      CREATE_BENEFICIARIES_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify({ beneficiaries: body.beneficiaries }),
      },
      CREATE_BENEFICIARIES_ERRORS,
    );

    const beneficiaryIds = data.map((item: any) => item?.beneficiary_id).filter(Boolean);
    if (!beneficiaryIds || beneficiaryIds.length === 0) {
      return NextResponse.json(
        { error: "Réponse invalide lors de la création des bénéficiaires." },
        { status: 502 },
      );
    }

    return NextResponse.json({ beneficiaryIds });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Une erreur est survenue lors de la création des bénéficiaires. Veuillez réessayer plus tard.";
    console.error("[createBeneficiariesV3]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}