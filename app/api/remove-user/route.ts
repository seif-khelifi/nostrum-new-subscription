import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchJSON, type FetchJSONOptions } from "@/lib/http";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RemoveUserRequestBody {
  id: string;
}

interface RemoveUserResponse {
  message: string;
  data: string;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

const REMOVE_URL = `${process.env.NOSTRUM_API_V3_BASE_URL}/proxy?route=remove_user`;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RemoveUserRequestBody;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? "";

  try {
    const data = await fetchJSON<RemoveUserResponse | null>(
      REMOVE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: body.id }),
      },
      undefined,          // no custom error map
      { allowEmpty: true }, // backend may return 200 with empty body
    );

    return NextResponse.json(data ?? { message: "Successful request.", data: "" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[remove-user]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
