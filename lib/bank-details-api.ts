import type { VitaBeneficiary, SessionUser } from "@/types/subscription";

/* ── createBeneficiariesV3 ── */

export interface CreateBeneficiariesV3Data {
  beneficiaryIds: string[];
}

export async function postCreateBeneficiariesV3(
  beneficiaries: VitaBeneficiary[],
  user_id: string,
): Promise<CreateBeneficiariesV3Data> {
  const res = await fetch("/api/createBeneficiariesV3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ beneficiaries, user_id }),
  });
  const data: CreateBeneficiariesV3Data & { error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return { beneficiaryIds: data.beneficiaryIds };
}

/* ── updateUserV3 ── */

export interface PaymentInfo {
  iban: string;
  bic: string;
  ibanHolderName: string;
}

export async function postUpdateUserV3(
  user: SessionUser,
  paymentInfo: PaymentInfo,
): Promise<void> {
  const res = await fetch("/api/updateUserV3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, payment_info: paymentInfo }),
  });
  const data: { success?: boolean; error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
}
