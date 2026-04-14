"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const offerRadioVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full transition-colors",
  {
    variants: {
      size: {
        default: "size-6 border-[2.5px]",
        sm: "size-5 border-2",
      },
      selected: {
        true: "border-[#9000E3] bg-[#F3E5FA]",
        false: "border-[#D1C9C0] bg-white",
      },
    },
    defaultVariants: {
      size: "default",
      selected: false,
    },
  },
)

const checkVariants = cva("text-[#9000E3]", {
  variants: {
    size: {
      default: "size-3.5",
      sm: "size-3",
    },
  },
  defaultVariants: { size: "default" },
})

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface OfferRadioProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof offerRadioVariants> {}

function OfferRadio({
  size = "default",
  selected = false,
  className,
  ...props
}: OfferRadioProps) {
  return (
    <span
      data-slot="offer-radio"
      className={cn(offerRadioVariants({ size, selected, className }))}
      {...props}
    >
      {selected && <Check className={checkVariants({ size })} strokeWidth={3} />}
    </span>
  )
}

export { OfferRadio, offerRadioVariants }
export type { OfferRadioProps }
