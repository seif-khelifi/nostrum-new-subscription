import type { BreakdownValues } from "@/components/ui/garantie-breakdown-card"

/* ------------------------------------------------------------------ */
/*  Shared types for garanties / comparateur tab structure              */
/* ------------------------------------------------------------------ */

export type CategoryMeta = {
  key: string
  icon: string
  title: string
  subtitle: string
}

export type TabBreakdowns = Record<string, BreakdownValues>
export type OfferTabs = { sante: TabBreakdowns; bienetre: TabBreakdowns }
export type AllTabs = Record<string, OfferTabs>
