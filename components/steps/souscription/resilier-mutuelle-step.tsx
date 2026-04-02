"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { ResilierMutuelleValue } from "@/types/subscription";

const DEFAULT_OPTIONS = [
  { value: "pas_de_mutuelle", label: "Je n'ai pas de mutuelle actuellement" },
  { value: "mutuelle_a_resilier", label: "J'ai une mutuelle à résilier" },
] as const;

export function ResilierMutuelleStep() {
  const { goToStepById } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("resilierMutuelle");

  const options = texts?.options ?? DEFAULT_OPTIONS;
  const selected = formData.resilierMutuelle;

  const handleNext = () => {
    if (!selected) return;

    switch (selected) {
      case "pas_de_mutuelle":
        // Skip directly to date début contrat Nostrum
        goToStepById("dateDebutNostrum");
        break;
      case "mutuelle_a_resilier":
        // Go through current insurance → date signature ancien → date début Nostrum
        goToStepById("currentInsurance");
        break;
    }
  };

  return (
    <StepScreen
      title={texts?.title ?? <>Mes infos d&apos;assurance</>}
      infoCard={
        texts?.banner ? <VariantBanner config={texts.banner} /> : undefined
      }
      canProceed={selected !== null}
      onNext={handleNext}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() =>
            updateFormData({
              resilierMutuelle: opt.value as ResilierMutuelleValue,
            })
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
    </StepScreen>
  );
}
