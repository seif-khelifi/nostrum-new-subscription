"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { ProtegerValue } from "@/types/subscription";

export function ProtegerStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("proteger");

  const options = texts.options!;
  const selected = formData.proteger;

  const selectedLabel = selected
    ? (options.find((o) => o.value === selected)?.label ?? "")
    : "";

  const handleNext = () => {
    if (!selected) return;
    next();
  };

  return (
    <StepScreen
      title={texts.title}
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <span>Je souhaite protéger</span>
          {selected && (
            <PillInput
              readOnly
              value={selectedLabel}
              placeholder=""
              inputClassName="min-w-[100px] sm:min-w-[140px]"
            />
          )}
        </div>
      }
      infoCard={
        texts.banner ? <AlertBanner {...texts.banner} /> : undefined
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
            updateFormData({ proteger: opt.value as ProtegerValue })
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
