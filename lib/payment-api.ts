import type { VitaSessionStorage } from "@/types/subscription";

export async function postCreateStripeCustomer(
  session: VitaSessionStorage,
): Promise<string> {
  const res = await fetch("/api/create-stripe-customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  const data: { customerId?: string; error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return data.customerId!;
}

export async function postSetupIntent(
  customerId: string,
  userId: string,
): Promise<string> {
  const res = await fetch("/api/setup-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_id: customerId, user_id: userId }),
  });
  const data: { clientSecret?: string; error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return data.clientSecret!;
}
