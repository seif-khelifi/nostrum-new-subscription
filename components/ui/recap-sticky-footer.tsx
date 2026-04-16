"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  RecapStickyFooter                                                  */
/*                                                                     */
/*  Layer 2 composed component:                                        */
/*  Fixed-bottom mobile bar with total price, folder logo, and CTA.    */
/*  Used in the recap step for both variant A and variant B.           */
/*                                                                     */
/*  Structure:                                                         */
/*  - Fixed bottom bar (bg-white, ring, z-10)                          */
/*  - Left: "Total" label + large price + /mois                        */
/*  - Right: folder logo image                                         */
/*  - Full-width CTA button below                                      */
/* ------------------------------------------------------------------ */

export interface RecapStickyFooterProps {
  /** Formatted total price string (e.g. "32,90€") */
  totalPrice: string;
  /** CTA button click handler */
  onContinue: () => void;
  /** CTA label override */
  ctaLabel?: string;
  /** Logo image path */
  logoSrc?: string;
  className?: string;
}

export function RecapStickyFooter({
  totalPrice,
  onContinue,
  ctaLabel = "Je reçois mon devis",
  logoSrc = "/drawers/drawer-garanties-b.svg",
  className,
}: RecapStickyFooterProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white ring-1 ring-[#EADFF1] z-10",
        className,
      )}
    >
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="font-bold text-[#9000E3] text-[1.1rem] leading-none">
              Total
            </div>
            <div className="mt-1 flex items-end gap-0.5">
              <span className="font-bold tracking-tight text-[#9000E3] text-[2rem] leading-none">
                {totalPrice}
              </span>
              <span className="font-semibold text-[#490076] mb-0.5 text-sm">
                /mois
              </span>
            </div>
          </div>
          <Image
            src={logoSrc}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0"
          />
        </div>

        <Button
          variant="ctaPurpleAccent"
          size="cta"
          className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-sm font-semibold"
          onClick={onContinue}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
