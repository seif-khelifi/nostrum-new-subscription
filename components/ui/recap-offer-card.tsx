"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfferAdvantagesAccordion } from "@/components/ui/offer-advantages-accordion";
import type { AdvantageLineItem } from "@/components/ui/offer-advantages-accordion";
import { PlanLogo } from "@/components/ui/plan-logo";
import type { OfferPlan } from "@/lib/plans";
import recapData from "@/data/recap.json";

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const recapOfferWrapperVariants = cva("rounded-[28px] p-[3px]", {
  variants: {
    tone: {
      gradient:
        "bg-[radial-gradient(178.77%_98.49%_at_50.14%_97.13%,#FBF4EA_0%,#FEA8CD_34.13%,#FEB1D0_47.45%,#CE99FF_62.98%,#9000E3_80.77%,#490076_100%)]",
      neutral: "bg-[#1D1B201A]",
    },
  },
  defaultVariants: {
    tone: "gradient",
  },
});

const recapOfferBadgeVariants = cva("text-sm font-semibold", {
  variants: {
    tone: {
      gradient: "text-white",
      neutral: "text-black/70",
    },
  },
  defaultVariants: {
    tone: "gradient",
  },
});

const recapOfferTitleVariants = cva(
  "capitalize font-bold text-[1.1rem] leading-none",
  {
    variants: {
      tone: {
        gradient: "text-[#490076]",
        neutral: "text-black",
      },
    },
    defaultVariants: {
      tone: "gradient",
    },
  },
);

const recapOfferPriceVariants = cva(
  "font-bold tracking-tight text-[2rem] leading-none",
  {
    variants: {
      tone: {
        gradient: "text-[#9000E3]",
        neutral: "text-black",
      },
    },
    defaultVariants: {
      tone: "gradient",
    },
  },
);

const recapOfferPeriodVariants = cva("font-semibold mb-0.5 text-sm", {
  variants: {
    tone: {
      gradient: "text-[#490076]",
      neutral: "text-black/60",
    },
  },
  defaultVariants: {
    tone: "gradient",
  },
});

const recapOfferChangeButtonVariants = cva(
  "w-full rounded-[20px] min-h-[48px] h-auto py-3 text-sm font-semibold",
  {
    variants: {
      tone: {
        gradient: "",
        neutral: "bg-black text-white hover:bg-black/90",
      },
    },
    defaultVariants: {
      tone: "gradient",
    },
  },
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RecapOfferData {
  plan: string;
  price: string;
  period?: string;
  descriptionTitle: string;
  description: string;
}

export interface RecapOfferCardProps
  extends VariantProps<typeof recapOfferWrapperVariants> {
  /** The selected offer — rendered as the main card */
  selectedOffer: RecapOfferData;
  /** Badge text above the selected card */
  badgeTitle?: string;
  /** Label for the "change offer" button */
  changeOfferLabel?: string;
  /** Handler for "change offer" */
  onChangeOffer?: () => void;
  /** Show loading spinner on the "change offer" button */
  changeOfferLoading?: boolean;
  /**
   * Custom logo to replace the default PlanLogo.
   * When provided, this ReactNode is rendered instead of the plan SVG.
   */
  logo?: React.ReactNode;
  /**
   * When true, the change-offer button is rendered inside the white card
   * (below the price) instead of outside the wrapper. Used by the neutral tone.
   */
  changeOfferInside?: boolean;
  /**
   * When true, accordion sections from data/recap.json are rendered
   * inside the white card below the plan header. Defaults to true for
   * gradient tone and false for neutral.
   */
  showAccordions?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  RecapOfferCard                                                     */
/*                                                                     */
/*  Layer 2 composed component:                                        */
/*  - Wrapper with tone-driven background (gradient or neutral)        */
/*  - "Mon offre choisie" badge                                        */
/*  - Inner white card with plan name, price, logo                     */
/*  - Optional accordion sections from data/recap.json                 */
/*  - "Changer d'offre" button (outside or inside card per tone)       */
/* ------------------------------------------------------------------ */

const accordions = recapData.accordions as Array<{
  accordionLabel: string;
  triggerImage?: string;
  triggerTitleColor?: string;
  content: AdvantageLineItem[];
}>;

function RecapOfferCard({
  selectedOffer,
  tone = "gradient",
  badgeTitle = "Mon offre choisie",
  changeOfferLabel = "Changer d'offre",
  onChangeOffer,
  changeOfferLoading = false,
  logo,
  changeOfferInside,
  showAccordions,
  className,
}: RecapOfferCardProps) {
  const resolvedTone = tone ?? "gradient";
  // Default: accordions on for gradient, off for neutral
  const renderAccordions = showAccordions ?? resolvedTone === "gradient";
  // Default: change button inside card for neutral, outside for gradient
  const buttonInside = changeOfferInside ?? resolvedTone === "neutral";

  const changeButton = onChangeOffer && (
    <Button
      variant="ghost"
      size="none"
      className={cn(
        resolvedTone === "gradient"
          ? "w-full rounded-[24px] min-h-[52px] h-auto py-3 bg-[#290E671A] text-[#290E67] text-sm font-semibold hover:bg-[#290E672A]"
          : recapOfferChangeButtonVariants({ tone: resolvedTone }),
      )}
      onClick={onChangeOffer}
      loading={changeOfferLoading}
    >
      {changeOfferLabel}
    </Button>
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Wrapper — tone-driven background */}
      <div className={cn(recapOfferWrapperVariants({ tone: resolvedTone }))}>
        <div className="rounded-[25px]">
          {/* Badge row */}
          <div
            className={cn(
              "flex items-center px-5 pt-4 pb-3",
              resolvedTone === "gradient"
                ? "justify-between"
                : "justify-center",
            )}
          >
            <span className={cn(recapOfferBadgeVariants({ tone: resolvedTone }))}>
              {badgeTitle}
            </span>
            {resolvedTone === "gradient" && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <Check className="h-3.5 w-3.5 text-[#6E00B3]" strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Inner white card */}
          <Card className="overflow-hidden border-0 bg-white shadow-none gap-0 rounded-[24px] ring-0">
            <CardHeader className="gap-4 px-5 pt-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle
                    className={cn(
                      recapOfferTitleVariants({ tone: resolvedTone }),
                    )}
                  >
                    {selectedOffer.plan}
                  </CardTitle>
                  <div className="mt-1 flex items-end gap-0.5">
                    <span
                      className={cn(
                        recapOfferPriceVariants({ tone: resolvedTone }),
                      )}
                    >
                      {selectedOffer.price}
                    </span>
                    <span
                      className={cn(
                        recapOfferPeriodVariants({ tone: resolvedTone }),
                      )}
                    >
                      {selectedOffer.period ?? "/mois"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {logo ?? (
                    <PlanLogo
                      plan={selectedOffer.plan as OfferPlan}
                      className="h-14 w-auto"
                      width={112}
                      height={56}
                    />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-0 px-5 pb-5">
              {/* Accordion sections — from data/recap.json */}
              {renderAccordions && (
                <div className="pt-2">
                  {accordions.map((section, idx) => (
                    <div
                      key={idx}
                      className="border-b border-[#EADFF1] last:border-b-0"
                    >
                      <OfferAdvantagesAccordion
                        value={`recap-section-${idx}`}
                        triggerLabel={section.accordionLabel}
                        triggerImage={section.triggerImage}
                        triggerTitleColor={section.triggerTitleColor}
                        lines={section.content}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Change offer button — inside card (neutral tone) */}
              {buttonInside && changeButton}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change offer button — outside card (gradient tone) */}
      {!buttonInside && changeButton}
    </div>
  );
}

export { RecapOfferCard, recapOfferWrapperVariants };
