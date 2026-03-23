import Image from "next/image"

export type OfferPlan = "decouverte" | "bronze" | "silver" | "gold"

interface PlanLogoProps {
  plan: string
  className?: string
  width?: number
  height?: number
}

/**
 * Renders the plan SVG logo from `/svg/offerLogos/{plan}.svg`.
 * Defaults to 72 × 36 — scale via `width`/`height` or `className`.
 */
export function PlanLogo({
  plan,
  className = "h-9 w-auto",
  width = 72,
  height = 36,
}: PlanLogoProps) {
  return (
    <Image
      src={`/svg/offerLogos/${plan}.svg`}
      alt={`${plan} logo`}
      width={width}
      height={height}
      className={className}
    />
  )
}
