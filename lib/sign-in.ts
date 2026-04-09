import type { SessionUser } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Client-side sign-in (OTP request)                                  */
/* ------------------------------------------------------------------ */

export async function requestOtp(phone: string): Promise<void> {
  const sanitizedPhone = phone.replace(/\+/, "");

  const res = await fetch("/api/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: sanitizedPhone }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
}

/* ------------------------------------------------------------------ */
/*  Client-side phone verification (OTP submit)                        */
/*                                                                     */
/*  Flow:                                                              */
/*  1. Verify OTP → route sets accessToken cookie                      */
/*  2. Check existing contracts (Vita / Tinder)                        */
/*  3. If no existing contract → get user → remove user (cleanup)      */
/*  4. Get user (final) → return SessionUser for session storage       */
/* ------------------------------------------------------------------ */

interface VerifyResult {
  user: SessionUser | null;
  hasVitaContract: boolean;
  hasTinderContract: boolean;
}

export async function verifyPhone(
  phone: string,
  otp: string,
): Promise<VerifyResult> {
  const sanitizedPhone = phone.replace(/\+/, "");
  const token = otp.replace(/\s/g, "");

  /* 1. Verify OTP — cookie is set by the route */
  const verifyRes = await fetch("/api/verify-phone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: sanitizedPhone, token, type: "sms" }),
  });
  const verifyData = await verifyRes.json();
  if (verifyData.error) throw new Error(verifyData.error);

  /* 2. Check existing contracts */
  const contractRes = await fetch("/api/check-contract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userPhone: sanitizedPhone }),
  });
  const contractData = await contractRes.json();
  if (contractData.error) throw new Error(contractData.error);

  const hasVitaContract: boolean = contractData.hasVitaContract ?? false;
  const hasTinderContract: boolean = contractData.hasTinderContract ?? false;

  /* 3. If existing contract → return early, no need to fetch user */
  if (hasVitaContract || hasTinderContract) {
    return { user: null, hasVitaContract, hasTinderContract };
  }

  /* 4. No existing contract → cleanup: get user id then remove */
  const cleanupUser = await fetchUser();
  // Fire-and-forget — matches old app behavior
  fetch("/api/remove-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: cleanupUser.id }),
  });

  /* 5. Get user (final) → return for session storage */
  const user = await fetchUser();

  return { user, hasVitaContract, hasTinderContract };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function fetchUser(): Promise<SessionUser> {
  const res = await fetch("/api/get-user");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  const users = Array.isArray(data) ? data : data.data;
  if (!users?.length) throw new Error("No user found");
  return users[0];
}
