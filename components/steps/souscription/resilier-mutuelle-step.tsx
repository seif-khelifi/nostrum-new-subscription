"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";
import type { ResilierMutuelleValue } from "@/types/subscription";

export function ResilierMutuelleStep() {
  const { next, launchSubFlow } = useStepper();
  const { uiData, updateUI } = useSanteForm();
  const { updatePrimary } = useSituationForm();
  const texts = useStepTexts("resilierMutuelle");

  const options = texts.options!;
  const selected = uiData.resilierMutuelle;
  const { error, validate } = useSelectionValidation(selected);

  const handleNext = () => {
    if (!validate()) return;

    if (selected === "pas_de_mutuelle") {
      // No existing insurance — clear any stale data and go directly to dateDebutNostrum
      updatePrimary({
        previousMutualTermination: false,
        previousHealthMutualName: undefined,
        previousHealthMutualAddress: "",
        previousContractStartDate: undefined,
        previousContractEndDate: undefined,
        previousContractEndDateAsked: undefined,
      });
      next(); // natural next → dateDebutNostrum (currentInsurance/dateSignatureAncien not in main flow)
    } else {
      // Has existing insurance — launch sub-flow for insurance details
      launchSubFlow(["currentInsurance", "dateSignatureAncien"], "dateDebutNostrum");
    }
  };

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
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
          onClick={() =>
            updateUI({
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
