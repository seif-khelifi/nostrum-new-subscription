import type { VitaSessionStorage } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Response parsing                                                   */
/* ------------------------------------------------------------------ */

export function extractStripeCustomerId(data: unknown): string {
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    const id = (data[0] as { id?: unknown }).id;
    if (typeof id === "string" && id.length > 0) return id;
  }
  throw new Error("Réponse invalide lors de la création du client de paiement.");
}

export function extractSetupIntentClientSecret(data: unknown): string {
  if (data && typeof data === "object") {
    const o = data as { client_secret?: unknown };
    if (typeof o.client_secret === "string" && o.client_secret.length > 0) {
      return o.client_secret;
    }
  }
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    const o = data[0] as { client_secret?: unknown };
    if (typeof o.client_secret === "string" && o.client_secret.length > 0) {
      return o.client_secret;
    }
  }
  throw new Error("Réponse invalide pour l’intention de configuration du paiement.");
}

/* ------------------------------------------------------------------ */
/*  Client → Next API routes                                         */
/* ------------------------------------------------------------------ */

export async function postCreateStripeCustomer(
  session: VitaSessionStorage,
): Promise<{ data: unknown }> {
  const res = await fetch("/api/create-stripe-customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  const json = (await res.json()) as { error?: string; data?: unknown };
  if (!res.ok || json.error) {
    throw new Error(json.error ?? "Impossible de préparer le paiement.");
  }
  return { data: json.data };
}

export async function postSetupIntent(
  customerId: string,
  userId: string,
): Promise<string> {
  const res = await fetch("/api/setup-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: customerId,
      user_id: userId,
    }),
  });
  const json = (await res.json()) as { error?: string; data?: unknown };
  if (!res.ok || json.error) {
    throw new Error(json.error ?? "Impossible de finaliser le paiement.");
  }
  return extractSetupIntentClientSecret(json.data);
}
