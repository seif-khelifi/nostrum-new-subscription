import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON, type ErrorMap } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface CreateSubscriptionRequestBody {
  contractId: string;
  userId: string;
  pspPaymentMethodId: string;
  customerId: string;
  selectedPlanIndex: number;
  unitAmount: number;
  prorated_price: number;
  coupon: string;
}

interface CreateSubscriptionResponseItem {
  id: string;
  latest_invoice?: {
    payment_intent?: {
      client_secret?: string;
    } | null;
  } | null;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  Error map                                                         */
/* ------------------------------------------------------------------ */

const CREATE_SUBSCRIPTION_ERRORS: ErrorMap = {
  400: "Données invalides. Veuillez vérifier vos informations.",
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Action non autorisée.",
  402: "Le paiement a été refusé. Veuillez vérifier votre moyen de paiement.",
  500: "Une erreur est survenue lors de la souscription. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */

const CREATE_SUBSCRIPTION_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=subscription`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateSubscriptionRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  try {
    const data = await fetchJSON<CreateSubscriptionResponseItem[]>(
      CREATE_SUBSCRIPTION_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify(body),
      },
      CREATE_SUBSCRIPTION_ERRORS,
    );

    const first = data?.[0];
    if (!first) {
      return NextResponse.json(
        { error: "Réponse invalide lors de la souscription." },
        { status: 502 },
      );
    }

    const clientSecret =
      first.latest_invoice?.payment_intent?.client_secret ?? null;

    return NextResponse.json({ clientSecret });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue lors de la souscription. Veuillez réessayer plus tard.";
    console.error("[createSubscriptionV3]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
