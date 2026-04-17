import type { VitaSessionStorage } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Contract status (business-level, not HTTP)                         */
/* ------------------------------------------------------------------ */

export type ContractStatus =
  | "PENDING"
  | "CREATION_IN_PROGRESS"
  | "DRAFT"
  | "STANDBY"
  | "ACTIVE"
  | "ONGOING"
  | "CLOSED"
  | "CANCELLED"
  | string;

/* ── createContractV3 ── */

export interface CreateContractV3Data {
  id: string;
  rk_OneSpanContractURL: string;
}

export async function postCreateContractV3(
  session: VitaSessionStorage,
  coupon?: { code: string; id: string },
): Promise<CreateContractV3Data> {
  const res = await fetch("/api/createContractV3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session, ...(coupon ? { coupon } : {}) }),
  });
  const data: CreateContractV3Data & { error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return { id: data.id, rk_OneSpanContractURL: data.rk_OneSpanContractURL };
}

/* ── getContractV3 ── */

export interface GetContractV3Data {
  contract: {
    id: string;
    status: ContractStatus;
    onboarding_status: string;
    onespan_id: string;
    [key: string]: unknown;
  };
}

export async function postGetContractV3(id: string): Promise<GetContractV3Data> {
  const res = await fetch("/api/getContractV3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data: GetContractV3Data & { error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return { contract: data.contract };
}

/* ── createSubscriptionV3 ── */

export interface CreateSubscriptionV3Payload {
  contractId: string;
  userId: string;
  pspPaymentMethodId: string;
  customerId: string;
  selectedPlanIndex: number;
  unitAmount: number;
  prorated_price: number;
  coupon: string;
}

export interface CreateSubscriptionV3Data {
  /** Stripe payment_intent client_secret, when additional confirmation is required. */
  clientSecret: string | null;
}

export async function postCreateSubscriptionV3(
  payload: CreateSubscriptionV3Payload,
): Promise<CreateSubscriptionV3Data> {
  const res = await fetch("/api/createSubscriptionV3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: CreateSubscriptionV3Data & { error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return { clientSecret: data.clientSecret ?? null };
}
