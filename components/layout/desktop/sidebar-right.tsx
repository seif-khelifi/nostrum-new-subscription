"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useVariant } from "@/context/VariantContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { useSituationForm } from "@/context/SituationFormContext";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { TotalSummary } from "@/components/ui/total-summary";
import { PLAN_DISPLAY_KEYS } from "@/lib/plans";
import { optionsData } from "@/lib/options";

const PLAN_KEYS = PLAN_DISPLAY_KEYS;

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
  const isRecapStep = currentStepDef.id === "devis_recap";

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

      {/* Options / Recap step — total summary card */}
      {(isOptionsStep || isRecapStep) && <OptionsTotalSummaryCard onContinue={next} />}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Options total summary — reads from session, renders in sidebar    */
/* ------------------------------------------------------------------ */

function OptionsTotalSummaryCard({ onContinue }: { onContinue: () => void }) {
  const { session } = useSituationForm();
  const { value: selectedOptions = [] } = useSessionStorage<string[]>(
    "selectedOptions",
    [],
  );

  const planIndex = session.selectedPlan ?? 0;
  const planName = PLAN_KEYS[planIndex] ?? "Bronze";
  const basePrice = session.plans?.[planName] ?? "0";

  const totalPrice = useMemo(() => {
    let total = parsePrice(basePrice);
    optionsData.forEach((opt) => {
      if (selectedOptions.includes(opt.id)) {
        total += parsePrice(opt.price);
      }
    });
    return formatPriceLabel(total);
  }, [basePrice, selectedOptions]);

  return (
    <TotalSummary
      card={false}
      planName={planName}
      totalPrice={totalPrice}
      optionCount={selectedOptions.length}
      onContinue={onContinue}
    />
  );
}
