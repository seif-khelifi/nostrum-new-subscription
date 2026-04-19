"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { PrimaryBeneficiary, Gender } from "@/types/subscription";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";

export function SexeStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const p = session.beneficiaries[0] as PrimaryBeneficiary | undefined;
  const texts = useStepTexts("sexe");

  const options = texts.options!;
  const selected = p?.gender ?? null;
  const { error, validate } = useSelectionValidation(selected);

  const selectedLabel = selected
    ? (options.find((o) => o.value === selected)?.label ?? "")
    : "";

  const handleNext = () => {
    if (!validate()) return;
    next();
  };

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <span>{texts.subtitle}</span>
          {selected && (
            <PillInput readOnly value={selectedLabel} placeholder="" />
          )}
        </div>
      }
      infoCard={
        texts.banner ? <AlertBanner {...texts.banner} /> : undefined
      }
      canProceed={selected !== null}
      onNext={handleNext}
      selectionError={error}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() => updatePrimary({ gender: opt.value as Gender })}
          className="justify-between"
        >
          <span>{opt.label}</span>
          {selected === opt.value && (
            <span className="flex size-5 sm:size-6 items-center justify-center rounded-full bg-[#490076] text-white animate-in fade-in-0 zoom-in-75 duration-200 ease-out">
              <Check className="size-3 sm:size-3.5" />
            </span>
          )}
        </Button>
      ))}
    </StepScreen>
  );
}
