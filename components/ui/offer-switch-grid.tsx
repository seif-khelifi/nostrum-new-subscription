"use client"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import type { OfferOption } from "@/lib/plans"

/* ------------------------------------------------------------------ */
/*  OfferSwitchGrid                                                    */
/*  2×2 grid of offer switches (used in comparateur-b, drawers)        */
/* ------------------------------------------------------------------ */

interface OfferSwitchGridProps {
  offers: OfferOption[]
  selected: string[]
  onToggle: (plan: string) => void
  className?: string
}

function OfferSwitchGrid({
  offers,
  selected,
  onToggle,
  className,
}: OfferSwitchGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {offers.map((offer) => {
        const isChecked = selected.includes(offer.plan)
        return (
          <label
            key={offer.plan}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-all",
              isChecked
                ? "border-2 border-[#CE99FF] bg-[#FAF4FB]"
                : "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
            )}
          >
            {/* Offer name + price */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[#290E67]">
                {offer.label}
              </span>
              <span className="text-base font-bold text-[#490076]">
                {offer.price}
              </span>
            </div>

            {/* Switch — compact size */}
            <Switch
              variant="gradient"
              size="compact"
              checked={isChecked}
              onCheckedChange={() => onToggle(offer.plan)}
            />
          </label>
        )
      })}
    </div>
  )
}

export { OfferSwitchGrid }
export type { OfferSwitchGridProps }
