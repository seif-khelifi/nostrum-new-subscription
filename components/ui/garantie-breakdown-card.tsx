import * as React from "react"
import { cn } from "@/lib/utils"
import {
  type BreakdownValues,
  resolveBreakdown,
  BreakdownBar,
} from "@/components/ui/garantie-breakdown-shared"

/* ------------------------------------------------------------------ */
/*  GarantieBreakdownCard                                              */
/* ------------------------------------------------------------------ */

interface GarantieBreakdownCardProps extends React.ComponentProps<"div"> {
  offerLabel: string
  total?: number
  breakdown: BreakdownValues
  currency?: string
}

function GarantieBreakdownCard({
  className,
  offerLabel,
  total,
  breakdown,
  currency = "€",
  ...props
}: GarantieBreakdownCardProps) {
  const resolved = resolveBreakdown(breakdown, total)

  return (
    <div
      data-slot="garantie-breakdown-card"
      className={cn("overflow-hidden rounded-[24px] bg-[#F3E5FA]", className)}
      {...props}
    >
      {/* Label row — centered above the white card */}
      <div className="px-4 pt-4 pb-3 text-center text-sm font-semibold">
        <span className="text-[#290E67]">Votre offre </span>
        <span className="text-[#9000E3]">{offerLabel}</span>
      </div>

      {/* White inner card — slight margin to show outer card edge */}
      <div className="mx-[3px] mb-[3px] rounded-[20px] bg-white px-4 py-4">
        <BreakdownBar values={resolved} currency={currency} />
      </div>
    </div>
  )
}

export { GarantieBreakdownCard }
export type { BreakdownValues, GarantieBreakdownCardProps }
