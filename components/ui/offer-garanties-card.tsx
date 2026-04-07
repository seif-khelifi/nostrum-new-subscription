import * as React from "react"
import Image from "next/image"
import { ArrowRight, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/*  OfferGarantiesCard                                                 */
/*                                                                     */
/*  Layer 2 composed component: white card with a hero illustration,   */
/*  title, subtitle, and two full-width action buttons.                */
/*  Used in the Devis desktop layout to showcase offer advantages.     */
/* ------------------------------------------------------------------ */

export interface OfferGarantiesCardProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Hero image rendered with padding at the top of the card */
  imageSrc: string
  imageAlt?: string
  /** Main title — rendered in bricolage-grotesque */
  title: React.ReactNode
  /** Subtitle — rendered in Inter */
  subtitle: React.ReactNode
  /** Label for the primary "Voir le tableau de garantie" button */
  primaryLabel: React.ReactNode
  onPrimaryClick?: () => void
  /** Label for the secondary "En savoir plus" button */
  secondaryLabel: React.ReactNode
  onSecondaryClick?: () => void
}

function OfferGarantiesCard({
  className,
  imageSrc,
  imageAlt = "Avantages illustration",
  title,
  subtitle,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  ...props
}: OfferGarantiesCardProps) {
  return (
    <div
      data-slot="offer-garanties-card"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-[#EADFF1]",
        className,
      )}
      {...props}
    >
      {/* Hero image — padded on top, left, right */}
      <div className="px-6 pt-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={300}
          className="h-auto w-full rounded-2xl"
          priority
        />
      </div>

      {/* Content — grows to fill remaining height, pushes buttons to bottom */}
      <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
        {/* Title — bricolage-grotesque, large */}
        <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-[2.25rem] font-bold leading-tight text-[#36276A]">
          {title}
        </h2>

        {/* Subtitle — Inter, regular */}
        <p className="mt-2 text-sm leading-relaxed text-[#290E67]">
          {subtitle}
        </p>

        {/* Action buttons — side by side, pushed to bottom */}
        <div className="mt-auto flex items-center gap-3 pt-6">
          <Button
            variant="linkChevron"
            type="button"
            onClick={onPrimaryClick}
          >
            {primaryLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            className={cn(
              "rounded-full px-5 h-10 text-sm font-semibold",
              "bg-[#290E67]/20 text-[#290E67]",
              "hover:bg-[#290E67]/30 transition-colors",
              "border-transparent shadow-none",
            )}
            onClick={onSecondaryClick}
          >
            {secondaryLabel}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { OfferGarantiesCard }
