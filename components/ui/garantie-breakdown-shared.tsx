"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LEGEND_ITEMS } from "@/lib/plans"
import { Progress } from "@/components/ui/progress"

/* ------------------------------------------------------------------ */
/*  Shared types                                                       */
/* ------------------------------------------------------------------ */

export type BreakdownValues = {
  assuranceMaladie?: number
  nostrumCare?: number
  votreReste?: number
}

export type ResolvedBreakdownValues = {
  assuranceMaladie: number
  nostrumCare: number
  votreReste: number
  total: number
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function clampAmount(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0
  return value
}

export function resolveBreakdown(
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

export function formatBreakdownPrice(value: number, currency = "€") {
  return `${value}${currency}`
}

/* ------------------------------------------------------------------ */
/*  BreakdownBar — proportional stacked bar                            */
/* ------------------------------------------------------------------ */

export function BreakdownBar({
  values,
  currency = "€",
}: {
  values: ResolvedBreakdownValues
  currency?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

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
      {items.map((item, idx) => (
        <div
          key={item.key}
          className="relative min-w-[56px] h-12"
          style={{ flex: item.value }}
          title={`${item.label}: ${formatBreakdownPrice(item.value, currency)}`}
        >
          <Progress
            value={mounted ? 100 : 0}
            className="h-full w-full bg-transparent rounded-[14px]"
            indicatorClassName="transition-transform duration-700 ease-out rounded-[14px]"
            indicatorStyle={item.style}
          />
          <span className={cn(
            "absolute inset-0 flex items-center justify-center px-3 text-sm font-bold truncate pointer-events-none",
            item.textClassName,
          )}>
            {formatBreakdownPrice(item.value, currency)}
          </span>
        </div>
      ))}
    </div>
  )
}
