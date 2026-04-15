"use client"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { OfferRadio } from "@/components/ui/offer-radio"

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const optionSelectCardVariants = cva(
  "flex w-full items-center gap-3 rounded-2xl p-4 transition-all text-left cursor-pointer",
  {
    variants: {
      selected: {
        true: "border-2 border-[#9000E3] bg-[#FAF4FB]",
        false: "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface OptionSelectCardProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof optionSelectCardVariants> {
  title: string
  description: string
  price: string
  onSelect: () => void
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function OptionSelectCard({
  title,
  description,
  price,
  selected = false,
  onSelect,
  className,
  ...props
}: OptionSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(optionSelectCardVariants({ selected, className }))}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-[1rem] font-bold leading-tight text-[#490076] font-[family-name:var(--font-inter)]">
          {title}
        </span>
        <p className="text-[0.85rem] leading-snug text-[#05061D] font-[family-name:var(--font-inter)]">
          {description}
        </p>
        <div className="flex items-end gap-0.5 mt-1">
          <span className="font-bold tracking-tight text-[#9000E3] text-lg leading-none">
            {price}
          </span>
          <span className="font-semibold text-[#490076] text-xs mb-0.5">
            /mois
          </span>
        </div>
      </div>
      <OfferRadio selected={!!selected} />
    </button>
  )
}

export { OptionSelectCard, optionSelectCardVariants }
export type { OptionSelectCardProps }
