import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON } from "@/lib/http";
import type { SessionUser } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface UpdateUserRequestBody {
  user: SessionUser;
  payment_info: {
    iban: string;
    bic: string;
    ibanHolderName: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  const body = (await req.json()) as UpdateUserRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  const userId = body.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Identifiant utilisateur manquant." },
      { status: 400 },
    );
  }

  const url = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=user&id=eq.${userId}`;

  try {
    await fetchJSON<unknown>(
      url,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
        },
        body: JSON.stringify({
          user: body.user,
          payment_info: body.payment_info,
        }),
      },
      undefined,
      { allowEmpty: true },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue lors de la mise à jour. Veuillez réessayer plus tard.";
    console.error("[updateUserV3]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
