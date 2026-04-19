"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";
import type { CommenceParQuiValue } from "@/types/subscription";
import type { StepId } from "@/config";

/** Sub-flow step order when conjoint is picked first */
const FAMILLE_CONJOINT_FIRST: StepId[] = [
  "nousSommes", "commenceParQui", "dateBirthConjoint", "dateBirthChildren",
];
/** Sub-flow step order when enfant is picked first */
const FAMILLE_ENFANT_FIRST: StepId[] = [
  "nousSommes", "commenceParQui", "dateBirthChildren", "dateBirthConjoint",
];

export function CommenceParQuiStep() {
  const { next, updateSubFlow } = useStepper();
  const { uiData, updateUI } = useSanteForm();
  const texts = useStepTexts("commenceParQui");

  const options = texts.options!;
  const selected = uiData.commenceParQui;
  const { error, validate } = useSelectionValidation(selected);

  const selectedLabel = selected
    ? (options.find((o) => o.value === selected)?.label ?? "")
    : "";

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
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
      infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
      canProceed={selected !== null}
      onNext={() => {
        if (!validate()) return;
        // Append the DOB steps to the sub-flow in the correct order
        updateSubFlow(
          selected === "conjoint"
            ? FAMILLE_CONJOINT_FIRST
            : FAMILLE_ENFANT_FIRST,
        );
        next();
      }}
      selectionError={error}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() =>
            updateUI({ commenceParQui: opt.value as CommenceParQuiValue })
          }
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
