import * as React from "react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BreakdownValues = {
  assuranceMaladie?: number
  nostrumCare?: number
  votreReste?: number
}

type ResolvedBreakdownValues = {
  assuranceMaladie: number
  nostrumCare: number
  votreReste: number
  total: number
}

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
/*  Legend config                                                      */
/* ------------------------------------------------------------------ */

const LEGEND_ITEMS = [
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function clampAmount(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0
  return value
}

function resolveBreakdown(
  breakdown: BreakdownValues,
  total?: number,
): ResolvedBreakdownValues {
  const assuranceMaladie = clampAmount(breakdown.assuranceMaladie)
  const nostrumCare = clampAmount(breakdown.nostrumCare)

  if (typeof breakdown.votreReste === "number") {
    const votreReste = clampAmount(breakdown.votreReste)
    return {
      assuranceMaladie,
      nostrumCare,
      votreReste,
      total: assuranceMaladie + nostrumCare + votreReste,
    }
  }

  if (typeof total === "number") {
    const safeTotal = clampAmount(total)
    return {
      assuranceMaladie,
      nostrumCare,
      votreReste: Math.max(0, safeTotal - assuranceMaladie - nostrumCare),
      total: safeTotal,
    }
  }

  return {
    assuranceMaladie,
    nostrumCare,
    votreReste: 0,
    total: assuranceMaladie + nostrumCare,
  }
}

function formatPrice(value: number, currency = "€") {
  return `${value}${currency}`
}

/* ------------------------------------------------------------------ */
/*  BreakdownBar — proportional stacked bar                            */
/* ------------------------------------------------------------------ */

function BreakdownBar({
  values,
  currency = "€",
}: {
  values: ResolvedBreakdownValues
  currency?: string
}) {
  const items = [
    {
      value: values.assuranceMaladie,
      label: LEGEND_ITEMS[0].label,
      style: LEGEND_ITEMS[0].style,
      textClassName: LEGEND_ITEMS[0].textClassName,
      key: LEGEND_ITEMS[0].key,
    },
    {
      value: values.nostrumCare,
      label: LEGEND_ITEMS[1].label,
      style: LEGEND_ITEMS[1].style,
      textClassName: LEGEND_ITEMS[1].textClassName,
      key: LEGEND_ITEMS[1].key,
    },
    {
      value: values.votreReste,
      label: LEGEND_ITEMS[2].label,
      style: LEGEND_ITEMS[2].style,
      textClassName: LEGEND_ITEMS[2].textClassName,
      key: LEGEND_ITEMS[2].key,
    },
  ].filter((item) => item.value > 0)

  return (
    <div className="flex w-full items-stretch gap-1">
      {items.map((item) => (
        <div
          key={item.key}
          className={cn(
            "flex h-12 min-w-[56px] items-center justify-center px-3 text-center text-sm font-bold rounded-[14px]",
            item.textClassName,
          )}
          style={{
            ...item.style,
            flex: item.value,
          }}
          title={`${item.label}: ${formatPrice(item.value, currency)}`}
        >
          <span className="truncate">{formatPrice(item.value, currency)}</span>
        </div>
      ))}
    </div>
  )
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
      className={cn("overflow-hidden rounded-[24px] bg-[#F3E5FA] p-3 flex flex-col gap-2", className)}
      {...props}
    >
      {offers.map((offer, i) => {
        const resolved = resolveBreakdown(offer.breakdown, offer.total)
        return (
          <div key={i} className="flex flex-col gap-2 rounded-[16px] bg-white px-4 py-3">
            <span className="text-sm font-semibold text-[#290E67]">
              Offre <span className="font-bold text-[#9000E3]">{offer.offerLabel}</span>
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
