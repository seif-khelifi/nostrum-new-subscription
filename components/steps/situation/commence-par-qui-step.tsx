"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { CommenceParQuiValue } from "@/types/subscription";

const OPTIONS = [
  { value: "conjoint", label: "Mon conjoint(e)" },
  { value: "enfant", label: "Mon enfant" },
] as const;

export function CommenceParQuiStep() {
  const { goToStepById } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  const selected = formData.commenceParQui;

  const selectedLabel = selected
    ? (OPTIONS.find((o) => o.value === selected)?.label ?? "")
    : "";

  const handleNext = () => {
    if (!selected) return;

    switch (selected) {
      case "conjoint":
        goToStepById("dateBirthConjoint");
        break;
      case "enfant":
        // enfant flow not implemented yet — skip to santé
        goToStepById("sante_yeux");
        break;
    }
  };

  return (
    <StepScreen
      title={<>On commence par qui ?</>}
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <span>Je veux protéger en premier mon</span>
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
      canProceed={selected !== null}
      onNext={handleNext}
    >
      {OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() =>
            updateFormData({ commenceParQui: opt.value as CommenceParQuiValue })
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
