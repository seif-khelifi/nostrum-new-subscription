import offersData from "@/data/offers.json"

/* ------------------------------------------------------------------ */
/*  Plan type — single source of truth                                 */
/* ------------------------------------------------------------------ */

export type OfferPlan = "decouverte" | "bronze" | "silver" | "gold"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const ALL_PLANS: OfferPlan[] = ["decouverte", "bronze", "silver", "gold"]

export const PLAN_INDEX: Record<string, number> = {
  decouverte: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
}

export const RECOMMENDED_OFFER: OfferPlan =
  (offersData.offers.find((o) => o.tone === "recommended")
    ?.plan as OfferPlan) ?? "silver"

/* ------------------------------------------------------------------ */
/*  Offer options (derived from offers.json)                           */
/* ------------------------------------------------------------------ */

export type OfferOption = {
  plan: string
  label: string
  price: string
}

export const OFFER_OPTIONS: OfferOption[] = offersData.offers.map((o) => ({
  plan: o.plan,
  label: o.plan.charAt(0).toUpperCase() + o.plan.slice(1),
  price: o.price,
}))

/* ------------------------------------------------------------------ */
/*  Legend items (for breakdown bars)                                   */
/* ------------------------------------------------------------------ */

export type LegendItem = {
  key: string
  label: string
  style: React.CSSProperties
  textClassName?: string
}

export const LEGEND_ITEMS: readonly LegendItem[] = [
  {
    key: "assuranceMaladie",
    label: "Assurance maladie",
    style: { backgroundColor: "#290E67" },
    textClassName: "text-white",
  },
  {
    key: "nostrumCare",
    label: "Nostrum Care",
    style: {
      background:
        "linear-gradient(86.29deg, #9000E3 1.49%, #CE99FF 45.06%, #FEA8CD 72.53%, #EFFB7D 100%)",
    },
    textClassName: "text-white",
  },
  {
    key: "votreReste",
    label: "Votre reste",
    style: { backgroundColor: "#CE99FF" },
    textClassName: "text-white",
  },
] as const
