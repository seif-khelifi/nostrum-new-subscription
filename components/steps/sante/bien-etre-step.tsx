"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { BienEtreValue } from "@/types/subscription";

const DEFAULT_OPTIONS = [
  { value: "classiques", label: "Je me limite aux soins classiques" },
  {
    value: "medecines_douces",
    label: "J'utilise parfois des médecines douces",
  },
  { value: "routine_complete", label: "J'ai une routine bien-être complète" },
] as const;

export function BienEtreStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSanteForm();
  const texts = useStepTexts("sante_bien_etre");

  const options = texts?.options ?? DEFAULT_OPTIONS;
  const selected = formData.bienEtre;

  const bannerNode =
    texts?.banner === null ? undefined : texts?.banner ? (
      <VariantBanner config={texts.banner} className="mt-2" />
    ) : undefined;

  return (
    <StepScreen
      title={texts?.title}
      canProceed={selected !== null}
      onNext={next}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() =>
            updateFormData({ bienEtre: opt.value as BienEtreValue })
          }
          className="justify-between"
        >
          <span>{opt.label}</span>
          {selected === opt.value && (
            <span className="flex size-5 sm:size-6 items-center justify-center rounded-full bg-[#490076] text-white">
              <Check className="size-3 sm:size-3.5" />
            </span>
          )}
        </Button>
      ))}

      {bannerNode}
    </StepScreen>
  );
}
