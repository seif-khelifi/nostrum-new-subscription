import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CheckContractRequestBody {
  userPhone: string;
}

interface CheckContractResult {
  hasVitaContract: boolean;
  hasTinderContract: boolean;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const CHECK_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/check_contract_tinder`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckContractRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  try {
    const data = await fetchJSON<CheckContractResult>(CHECK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
      },
      body: JSON.stringify({ userPhone: body.userPhone }),
    });

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[check-contract]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
