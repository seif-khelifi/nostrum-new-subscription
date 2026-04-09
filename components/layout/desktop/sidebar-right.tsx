"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useVariant } from "@/context/VariantContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { TotalSummary } from "@/components/ui/total-summary";
import offersData from "@/data/offers.json";
import optionsJson from "@/data/options.json";

export interface DesktopSidebarRightProps {
  className?: string;
}

/**
 * Right sidebar for variant A desktop layout.
 *
 * Fixed cards:
 * 1. Call card — dark (#490076) with call.svg image
 *
 * Dynamic card:
 * 2. Current step's banner (from variant config) — rendered when the
 *    step has a `banner` entry. Replaces the static "médecines douces"
 *    card with contextual info for each step.
 *
 * Visibility is controlled by the parent DesktopShell — the right sidebar
 * is hidden when the left sidebar collapses (below lg breakpoint).
 */
export function DesktopSidebarRight({ className }: DesktopSidebarRightProps) {
  const { currentStepDef, next } = useStepper();
  const { texts } = useVariant();

  const stepBanner = texts[currentStepDef.id]?.banner;
  const isOptionsStep = currentStepDef.id === "options";

  return (
    <aside
      className={cn(
        /* base */
        "fixed top-0 right-0 bottom-0 z-40 overflow-y-auto overflow-x-hidden bg-background border-l border-[#E9E6DF]",
        /* width + opacity transition */
        "transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        /* responsive visibility & width */
        "hidden lg:flex lg:flex-col lg:w-72 xl:w-80",
        /* cards close to the top */
        "gap-4 px-8 pt-4",
        className,
      )}
    >
      {/* Call card (always visible) */}
      <AlertBanner
        variant="sidebarDark"
        layout="responsive"
        title="Parler à un conseiller"
        subtitle="On vous rappelle dans la journée"
        imageSrc="/alertBanner/call.svg"
        imageAlt="Appeler un conseiller"
        imageFill
      />

      {/* Step banner — dynamic, from variant config */}
      {stepBanner && (
        <AlertBanner
          variant="default"
          layout="responsive"
          title={stepBanner.title}
          subtitle={stepBanner.subtitle}
          icon={stepBanner.icon}
          imageSrc={stepBanner.imageSrcHorizontal ?? stepBanner.imageSrc}
          imageAlt={stepBanner.imageAlt}
          imageFill={!!(stepBanner.imageSrcHorizontal ?? stepBanner.imageSrc)}
        />
      )}

      {/* Options step — total summary card */}
      {isOptionsStep && <OptionsTotalSummaryCard onContinue={next} />}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Options total summary — reads from session, renders in sidebar    */
/* ------------------------------------------------------------------ */

function OptionsTotalSummaryCard({ onContinue }: { onContinue: () => void }) {
  const { value: selectedOfferIndex } = useSessionStorage<number | null>(
    "selectedOffer",
    0,
  );
  const { value: selectedOptions = [] } = useSessionStorage<string[]>(
    "selectedOptions",
    [],
  );

  const baseOffer = useMemo(() => {
    const idx = selectedOfferIndex ?? 0;
    return offersData.offers[idx] || offersData.offers[0];
  }, [selectedOfferIndex]);

  const totalPrice = useMemo(() => {
    let total = parsePrice(baseOffer.price);
    (optionsJson as Array<{ id: string; price: string }>).forEach((opt) => {
      if (selectedOptions.includes(opt.id)) {
        total += parsePrice(opt.price);
      }
    });
    return formatPriceLabel(total);
  }, [baseOffer.price, selectedOptions]);

  return (
    <TotalSummary
      card={false}
      planName={baseOffer.plan}
      totalPrice={totalPrice}
      optionCount={selectedOptions.length}
      onContinue={onContinue}
    />
  );
}
