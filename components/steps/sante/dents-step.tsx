"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";
import type { DentsValue } from "@/types/subscription";

export function DentsStep() {
  const { next } = useStepper();
  const { uiData, updateUI } = useSanteForm();
  const texts = useStepTexts("sante_dents");

  const options = texts.options!;
  const selected = uiData.dents;
  const { error, validate } = useSelectionValidation(selected);

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
      canProceed={selected !== null}
      onNext={() => {
        if (validate()) next();
      }}
      selectionError={error}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() => updateUI({ dents: opt.value as DentsValue })}
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
      {texts.banner ? (
        <div className={texts.navbarTitle ? "sm:hidden" : undefined}>
          <AlertBanner {...texts.banner} className="mt-2" />
        </div>
      ) : null}
    </StepScreen>
  );
}
