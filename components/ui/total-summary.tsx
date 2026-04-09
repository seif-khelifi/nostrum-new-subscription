"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  CVA variants                                                      */
/* ------------------------------------------------------------------ */

const totalSummaryVariants = cva("w-full", {
  variants: {
    card: {
      true: "bg-white rounded-[24px] p-5 ring-1 ring-[#EADFF1]",
      false: "",
    },
  },
  defaultVariants: {
    card: false,
  },
});

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export interface TotalSummaryProps
  extends VariantProps<typeof totalSummaryVariants> {
  /** Plan display name (e.g. "silver") */
  planName: string;
  /** Formatted total price string (e.g. "32,90€") */
  totalPrice: string;
  /** Number of selected options — pill hidden when 0 */
  optionCount: number;
  /** CTA click handler — button hidden when omitted */
  onContinue?: () => void;
  /** CTA label override */
  ctaLabel?: string;
  className?: string;
}

/**
 * Displays a plan summary with price, selected-options pill, and
 * an optional CTA button.
 *
 * Use `card={true}` to wrap the content in a rounded card with ring
 * (variant B desktop, mobile bottom bar). Use `card={false}` when
 * the summary is rendered inside an existing container (variant A
 * right sidebar).
 */
export function TotalSummary({
  planName,
  totalPrice,
  optionCount,
  onContinue,
  ctaLabel = "Valider mon offre",
  card,
  className,
}: TotalSummaryProps) {
  return (
    <div className={cn(totalSummaryVariants({ card }), className)}>
      {/* Plan info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="capitalize font-bold text-[#490076] text-[1.1rem] leading-none">
            {planName}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-end gap-0.5">
              <span className="font-bold tracking-tight text-[#9000E3] text-[2rem] leading-none">
                {totalPrice}
              </span>
              <span className="font-semibold text-[#490076] mb-0.5 text-sm">
                /mois
              </span>
            </div>
            {optionCount > 0 && (
              <div className="ml-2 flex items-center gap-1 bg-[#FBF4EA] px-3 py-1 rounded-full ring-1 ring-[#EADFF1]">
                <span className="text-[#490076] text-sm font-semibold">
                  Options {optionCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {onContinue && (
        <Button
          variant="ctaPurpleDark"
          size="cta"
          className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-[clamp(0.8rem,2.5vw,0.95rem)] font-semibold lg:min-h-12 lg:px-6"
          onClick={onContinue}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

export { totalSummaryVariants };
