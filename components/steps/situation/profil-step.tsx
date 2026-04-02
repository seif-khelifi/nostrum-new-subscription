"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { ProfilValue } from "@/types/subscription";

export function ProfilStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("profil");

  const options = texts.options!;
  const selected = formData.profil;

  const selectedLabel = selected
    ? (options.find((o) => o.value === selected)?.label ?? "")
    : "";

  return (
    <StepScreen
      title={texts.title}
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <span>Je suis</span>
          {selected && (
            <PillInput readOnly value={selectedLabel} placeholder="" />
          )}
        </div>
      }
      infoCard={
        texts.banner ? <VariantBanner config={texts.banner} /> : undefined
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
          onClick={() => updateFormData({ profil: opt.value as ProfilValue })}
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
