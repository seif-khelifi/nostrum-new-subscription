"use client";

import * as React from "react";
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
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RecapOfferData {
  plan: string;
  price: string;
  period?: string;
  descriptionTitle: string;
  description: string;
}

export interface RecapOfferCardProps {
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
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  RecapOfferCard                                                     */
/*                                                                     */
/*  Layer 2 composed component:                                        */
/*  - Gradient border wrapper with "Mon offre choisie" badge           */
/*  - Inner white card with plan name, price, logo (no description)    */
/*  - N OfferAdvantagesAccordion sections from data/recap.json         */
/*  - "Changer d'offre" button below                                   */
/* ------------------------------------------------------------------ */

const accordions = recapData.accordions as Array<{
  accordionLabel: string;
  triggerImage?: string;
  triggerTitleColor?: string;
  content: AdvantageLineItem[];
}>;

function RecapOfferCard({
  selectedOffer,
  badgeTitle = "Mon offre choisie",
  changeOfferLabel = "Changer d'offre",
  onChangeOffer,
  changeOfferLoading = false,
  className,
}: RecapOfferCardProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Selected offer — gradient border wrapper */}
      <div
        className={cn(
          "rounded-[28px] p-[3px]",
          "bg-[radial-gradient(178.77%_98.49%_at_50.14%_97.13%,#FBF4EA_0%,#FEA8CD_34.13%,#FEB1D0_47.45%,#CE99FF_62.98%,#9000E3_80.77%,#490076_100%)]",
        )}
      >
        <div className="rounded-[25px] bg-transparent">
          {/* Badge row */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <span className="text-sm font-semibold text-white">
              {badgeTitle}
            </span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <Check className="h-3.5 w-3.5 text-[#6E00B3]" strokeWidth={3} />
            </div>
          </div>

          {/* Inner white card — plan name + price + logo */}
          <Card className="overflow-hidden border-0 bg-white shadow-none gap-0 rounded-[24px] ring-0">
            <CardHeader className="gap-4 px-5 pt-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="capitalize font-bold text-[#490076] text-[1.1rem] leading-none">
                    {selectedOffer.plan}
                  </CardTitle>
                  <div className="mt-1 flex items-end gap-0.5">
                    <span className="font-bold tracking-tight text-[#9000E3] text-[2rem] leading-none">
                      {selectedOffer.price}
                    </span>
                    <span className="font-semibold text-[#490076] mb-0.5 text-sm">
                      {selectedOffer.period ?? "/mois"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <PlanLogo
                    plan={selectedOffer.plan as OfferPlan}
                    className="h-14 w-auto"
                    width={112}
                    height={56}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-0 px-5 pb-5">
              {/* Accordion sections — from data/recap.json */}
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change offer button */}
      {onChangeOffer && (
        <Button
          variant="ghost"
          size="none"
          className="w-full rounded-[24px] min-h-[52px] h-auto py-3 bg-[#290E671A] text-[#290E67] text-sm font-semibold hover:bg-[#290E672A]"
          onClick={onChangeOffer}
          loading={changeOfferLoading}
        >
          {changeOfferLabel}
        </Button>
      )}
    </div>
  );
}

export { RecapOfferCard };
