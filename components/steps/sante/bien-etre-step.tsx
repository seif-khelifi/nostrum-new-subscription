"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";
import type { BienEtreValue } from "@/types/subscription";

export function BienEtreStep() {
  const { next } = useStepper();
  const { uiData, updateUI } = useSanteForm();
  const texts = useStepTexts("sante_bien_etre");

  const options = texts.options!;
  const selected = uiData.bienEtre;
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
          onClick={() => updateUI({ bienEtre: opt.value as BienEtreValue })}
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
      {texts.banner ? (
        <div className={texts.navbarTitle ? "sm:hidden" : undefined}>
          <AlertBanner {...texts.banner} className="mt-2" />
        </div>
      ) : null}
    </StepScreen>
  );
}
