"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdvisorCard } from "@/components/ui/advisor-card";
import { useStepper } from "@/context/StepperContext";

export interface RecapNavbarVariantAProps {
  className?: string;
}

/**
 * Custom desktop navbar for the devis_recap step (Variant A).
 *
 * 3-section layout separated by 2px #E9E6DF vertical dividers,
 * with a 2px bottom border in the same colour.
 *
 * Section 1 (left):   Nostrum logo + back button
 * Section 2 (centre): Title + subtitle with "Modifier" link
 * Section 3 (right):  AdvisorCard (reusable component)
 */
export function RecapNavbarVariantA({
  className,
}: RecapNavbarVariantAProps) {
  const { isFirstStep, back, goToStepById } = useStepper();

  return (
    <header
      className={cn(
        "flex items-stretch bg-white border-b-[2px] border-[#E9E6DF]",
        className,
      )}
    >
      {/* ── Section 1: Logo + Back ── */}
      <div className="flex items-center gap-3 pl-6 pr-5 py-4 shrink-0">
        <Button
          variant="ghostCircle"
          aria-label="Retour"
          disabled={isFirstStep}
          onClick={back}
          className="h-10 w-10 disabled:opacity-40 disabled:pointer-events-none shrink-0"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
        </Button>

        <Image
          src="/navbarMobile/nostrum-logo.svg"
          alt="Nostrum"
          width={100}
          height={32}
          className="h-8 w-auto object-contain shrink-0"
          unoptimized
        />
      </div>

      {/* Separator */}
      <div className="w-[2px] bg-[#E9E6DF] self-stretch" />

      {/* ── Section 2: Title + Subtitle ── */}
      <div className="flex-1 flex flex-col justify-center pl-20 pr-6 py-6 min-w-0">
        <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#290E67] m-0">
          Votre offre mutuelle sur-mesure
        </h1>
        <p className="mt-1 text-sm text-black m-0">
          Pour vous et votre famille{" "}
          <button
            type="button"
            onClick={() => goToStepById("proteger")}
            className="text-[#9000E3] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0 inline"
          >
            Modifier
          </button>
        </p>
      </div>

      {/* Separator */}
      <div className="w-[2px] bg-[#E9E6DF] self-stretch" />

      {/* ── Section 3: Advisor Card ── */}
      <div className="flex items-center px-5 py-4 shrink-0">
        <AdvisorCard />
      </div>
    </header>
  );
}
