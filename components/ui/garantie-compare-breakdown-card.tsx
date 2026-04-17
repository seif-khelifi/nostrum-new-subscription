import * as React from "react"
import { cn } from "@/lib/utils"
import {
  type BreakdownValues,
  resolveBreakdown,
  BreakdownBar,
} from "@/components/ui/garantie-breakdown-shared"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CompareOfferItem {
  offerLabel: string
  breakdown: BreakdownValues
  total?: number
}

interface GarantieCompareBreakdownCardProps extends React.ComponentProps<"div"> {
  offers: CompareOfferItem[]
  currency?: string
}

/* ------------------------------------------------------------------ */
/*  GarantieCompareBreakdownCard                                       */
/* ------------------------------------------------------------------ */

function GarantieCompareBreakdownCard({
  className,
  offers,
  currency = "€",
  ...props
}: GarantieCompareBreakdownCardProps) {
  return (
    <div
      data-slot="garantie-compare-breakdown-card"
      className={cn(
        // Outer purple shell — mirrors OptionCard's unselected outer
        // (rounded-[28px] · p-[3px] · bg-[#F3E5FA]). `p-[3px]` creates
        // the thin purple border effect around each inner white card,
        // `gap-[3px]` keeps the same 3px bleed between stacked rows.
        "overflow-hidden rounded-[28px] bg-[#F3E5FA] p-[3px] flex flex-col gap-[3px]",
        className,
      )}
      {...props}
    >
      {offers.map((offer, i) => {
        const resolved = resolveBreakdown(offer.breakdown, offer.total)
        return (
          <div
            key={i}
            // Inner white card — mirrors OptionCard's inner white card
            // (rounded-[25px] · bg-white · ring-1 ring-[#EADFF1] · px-5 py-5).
            className="flex flex-col gap-2 rounded-[25px] bg-white ring-1 ring-[#EADFF1] px-5 py-5"
          >
            <span className="text-sm font-semibold text-[#290E67]">
              Offre{" "}
              <span className="font-bold text-[#9000E3]">
                {offer.offerLabel}
              </span>
            </span>
            <BreakdownBar values={resolved} currency={currency} />
          </div>
        )
      })}
    </div>
  )
}

export { GarantieCompareBreakdownCard }
export type { BreakdownValues, GarantieCompareBreakdownCardProps, CompareOfferItem }
