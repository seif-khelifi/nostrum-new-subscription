"use client"

import { cva, type VariantProps } from "class-variance-authority"

import { cn, capitalize } from "@/lib/utils"
import type { OfferPlan } from "@/lib/plans"
import { OFFER_BG_COLORS } from "@/lib/plans"
import { PlanLogo } from "@/components/ui/plan-logo"
import { OfferRadio } from "@/components/ui/offer-radio"

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const offerSelectCardVariants = cva(
  "flex w-full transition-all text-left cursor-pointer",
  {
    variants: {
      /** row = compact horizontal list item · featured = tall card with logo hero */
      layout: {
        row: "items-center gap-3 rounded-2xl p-3",
        featured: "h-full flex-col rounded-2xl overflow-hidden",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        layout: "row",
        selected: true,
        className: "border-2 border-[#9000E3] bg-[#FAF4FB]",
      },
      {
        layout: "row",
        selected: false,
        className: "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
      },
      {
        layout: "featured",
        selected: true,
        className: "border-2 border-[#9000E3] shadow-[0_0_0_1px_#9000E3]",
      },
      {
        layout: "featured",
        selected: false,
        className: "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
      },
    ],
    defaultVariants: {
      layout: "row",
      selected: false,
    },
  },
)

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface OfferSelectCardProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof offerSelectCardVariants> {
  plan: OfferPlan
  price: string
  onSelect: () => void
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function OfferSelectCard({
  plan,
  price,
  layout = "row",
  selected = false,
  onSelect,
  className,
  ...props
}: OfferSelectCardProps) {
  if (layout === "featured") {
    const bgColor = OFFER_BG_COLORS[plan] ?? "#F4F3FA"
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(offerSelectCardVariants({ layout, selected, className }))}
        {...props}
      >
        {/* Logo hero with plan background — taller than a row card so the
            recommended offer visually stands out in the change-offer drawer.
            Grows along the image axis (bigger logo + more padding) rather
            than inflating the bottom white area, which would look lopsided. */}
        <div
          className="flex flex-1 items-center justify-center px-6 pt-10 pb-8"
          style={{ backgroundColor: bgColor }}
        >
          <PlanLogo
            plan={plan}
            className="h-22 w-auto"
            width={176}
            height={88}
          />
        </div>

        {/* Name + price + radio */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold text-[#290E67]">
              {capitalize(plan)}
            </span>
            <span className="text-lg font-bold text-[#490076]">{price}</span>
          </div>
          <OfferRadio selected={!!selected} />
        </div>
      </button>
    )
  }

  /* ── Row layout (default) ── */
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(offerSelectCardVariants({ layout, selected, className }))}
      {...props}
    >
      <PlanLogo
        plan={plan}
        className="h-7 w-auto shrink-0"
        width={56}
        height={28}
      />
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-[#290E67]">
          {capitalize(plan)}
        </span>
        <span className="text-base font-bold text-[#490076]">{price}</span>
      </div>
      <OfferRadio selected={!!selected} />
    </button>
  )
}

export { OfferSelectCard, offerSelectCardVariants }
export type { OfferSelectCardProps }
