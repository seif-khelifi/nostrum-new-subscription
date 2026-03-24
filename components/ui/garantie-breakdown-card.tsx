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

interface GarantieBreakdownCardProps extends React.ComponentProps<"div"> {
  offerLabel: string
  total?: number
  breakdown: BreakdownValues
  currency?: string
}

/* ------------------------------------------------------------------ */
/*  Legend config (shared with the parent legend display)              */
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
      {items.map((item, index) => (
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
/*  GarantieBreakdownCard                                              */
/* ------------------------------------------------------------------ */

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
