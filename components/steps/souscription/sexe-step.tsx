"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { SexeValue } from "@/types/subscription";

const DEFAULT_OPTIONS = [
  { value: "homme", label: "Un homme" },
  { value: "femme", label: "Une femme" },
  { value: "autre", label: "Aucun des deux" },
] as const;

export function SexeStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("sexe");

  const options = texts?.options ?? DEFAULT_OPTIONS;
  const selected = formData.sexe;

  return (
    <StepScreen
      title={texts?.title ?? "Faisons connaissance"}
      subtitle={texts?.subtitle ?? "Vous êtes ?"}
      infoCard={
        texts?.banner ? <VariantBanner config={texts.banner} /> : undefined
      }
      canProceed={selected !== null}
      onNext={next}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() => updateFormData({ sexe: opt.value as SexeValue })}
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
