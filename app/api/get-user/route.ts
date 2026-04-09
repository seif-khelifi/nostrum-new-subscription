import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON } from "@/lib/http";
import type { SessionUser } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GetUserResponse {
  message: string;
  data: SessionUser[];
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const USER_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=user?select=*,contract(*,product(*))`;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  try {
    const data = await fetchJSON<GetUserResponse>(USER_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-environment": process.env.NEXT_PUBLIC_ENV ?? "",
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[get-user]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
