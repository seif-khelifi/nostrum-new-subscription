import { NextRequest, NextResponse } from "next/server";
import { fetchJSON, type ErrorMap } from "@/lib/http";

interface StripeCustomer {
  id: string;
}

const CREATE_STRIPE_CUSTOMER_ERRORS: ErrorMap = {
  400: "Données invalides. Vérifiez vos informations.",
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Action non autorisée.",
  500: "Une erreur est survenue. Veuillez réessayer plus tard.",
  503: "Service temporairement indisponible. Veuillez réessayer plus tard.",
};

const CREATE_CUSTOMER_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=stripe/create-customer`;

export async function POST(req: NextRequest) {
  const body: unknown = await req.json();

  try {
    const data = await fetchJSON<StripeCustomer[]>(
      CREATE_CUSTOMER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          senderplatform: "WEB",
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify(body),
      },
      CREATE_STRIPE_CUSTOMER_ERRORS,
    );

    const customerId = data[0]?.id;
    if (!customerId) {
      return NextResponse.json(
        { error: "Réponse invalide lors de la création du client de paiement." },
        { status: 502 },
      );
    }

    return NextResponse.json({ customerId });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue. Veuillez réessayer plus tard.";
    console.error("[create-stripe-customer]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
