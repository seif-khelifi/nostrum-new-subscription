"use client"

import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const outerCardVariants = cva(
  "w-full rounded-[28px] p-[3px] pb-0 overflow-hidden transition-colors duration-300",
  {
    variants: {
      selected: {
        false: "bg-[#F3E5FA]",
        true: "bg-[#490076]",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

const topTextVariants = cva(
  "text-sm font-semibold transition-colors duration-300",
  {
    variants: {
      selected: {
        false: "text-[#490076]",
        true: "text-white",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

const bottomButtonVariants = cva(
  "inline-flex items-center gap-1 text-sm font-medium transition-colors duration-300 hover:opacity-80 active:scale-95 active:opacity-60",
  {
    variants: {
      selected: {
        false: "text-[#490076]",
        true: "text-white",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

/* ------------------------------------------------------------------ */
/*  OptionCard                                                         */
/* ------------------------------------------------------------------ */

interface OptionCardProps {
  /** Top label (e.g. "Option n°1") */
  topLabel: string
  title: string
  description: string
  price: string
  selected: boolean
  onToggle: (checked: boolean) => void
  /** "En savoir plus" handler */
  onMoreClick?: () => void
  /** Image source for the icon */
  imageSrc?: string
  className?: string
}

function OptionCard({
  topLabel,
  title,
  description,
  price,
  selected: isSelected,
  onToggle,
  onMoreClick,
  imageSrc = "/options/illustration=Sante.svg",
  className,
}: OptionCardProps) {
  return (
    <div className={cn(outerCardVariants({ selected: isSelected }), className)}>
      {/* Outer Top: Label (Centered) */}
      <div className="flex items-center justify-center px-5 pt-3 pb-3">
        <span className={topTextVariants({ selected: isSelected })}>
          {topLabel}
        </span>
      </div>

      {/* Inner White Card */}
      <div className="rounded-[25px] bg-white ring-1 ring-[#EADFF1] px-5 py-5 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="text-[1.1rem] leading-none font-bold text-[#490076] pr-4">
            {title}
          </div>
          <Image
            src={imageSrc}
            alt=""
            width={40}
            height={40}
            className="shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>

        <p className="text-[0.9rem] leading-snug text-[#490076] opacity-90 mt-2 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-end gap-0.5">
            <span className="font-bold tracking-tight text-[#9000E3] text-[1.75rem] leading-none">
              {price}
            </span>
            <span className="font-semibold text-[#490076] text-sm mb-0.5">
              /mois
            </span>
          </div>
          <Switch
            variant="gradient"
            size="compact"
            checked={isSelected}
            onCheckedChange={onToggle}
          />
        </div>
      </div>

      {/* Outer Bottom: En savoir plus */}
      {onMoreClick && (
        <div className="flex items-center justify-center px-5 pt-3 pb-4">
          <button
            type="button"
            onClick={onMoreClick}
            className={bottomButtonVariants({ selected: isSelected })}
          >
            En savoir plus
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export {
  OptionCard,
  outerCardVariants,
  topTextVariants,
  bottomButtonVariants,
}
export type { OptionCardProps }
