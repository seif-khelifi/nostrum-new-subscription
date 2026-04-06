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
        "overflow-hidden rounded-[24px] bg-[#F3E5FA] p-3 flex flex-col gap-2",
        className,
      )}
      {...props}
    >
      {offers.map((offer, i) => {
        const resolved = resolveBreakdown(offer.breakdown, offer.total)
        return (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-[16px] bg-white px-4 py-3"
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
