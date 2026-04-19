"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";
import type { ProtegerValue, SecondaryBeneficiary } from "@/types/subscription";

export function ProtegerStep() {
  const { next, launchSubFlow } = useStepper();
  const { session, setBeneficiaries } = useSituationForm();
  const { uiData, updateUI } = useSanteForm();
  const texts = useStepTexts("proteger");

  const options = texts.options!;
  const selected = uiData.proteger;
  const { error, validate } = useSelectionValidation(selected);

  const selectedLabel = selected
    ? (options.find((o) => o.value === selected)?.label ?? "")
    : "";

  const handleSelect = (value: ProtegerValue) => {
    const familyCount = value === "conjoint_et_moi" ? 2 : null;

    // Auto-set commenceParQui when the step will be skipped
    const commenceParQui =
      value === "conjoint_et_moi"
        ? "conjoint" as const
        : value === "enfants_et_moi"
          ? "enfant" as const
          : uiData.commenceParQui;

    updateUI({ proteger: value, familyCount, commenceParQui });

    // Build beneficiaries: keep primary, set secondaries based on choice
    const primary = session.beneficiaries[0];
    let secondaries: SecondaryBeneficiary[] = [];

    if (value === "conjoint_et_moi") {
      const existing = session.beneficiaries.find((b) => b.relationship === "MARRIED") as SecondaryBeneficiary | undefined;
      secondaries = [existing ?? { relationship: "MARRIED", birthdate: "" } as SecondaryBeneficiary];
    }
    // enfants_et_moi and famille: nousSommes step will create them

    setBeneficiaries(primary ? [primary, ...secondaries] : [...secondaries]);
  };

  const handleNext = () => {
    if (!validate()) return;

    switch (selected) {
      case "moi":
        // No family steps needed — go to santé directly (natural next in main flow)
        next();
        break;
      case "conjoint_et_moi":
        // Only need conjoint DOB
        launchSubFlow(["dateBirthConjoint"], "sante_yeux");
        break;
      case "enfants_et_moi":
        // Need family count → children DOBs
        launchSubFlow(["nousSommes", "dateBirthChildren"], "sante_yeux");
        break;
      case "famille":
        // Need family count → who first → then DOBs (order decided by commenceParQui)
        launchSubFlow(["nousSommes", "commenceParQui"], "sante_yeux");
        break;
      default:
        next();
    }
  };

  return (
    <StepScreen
      title={texts.title} hideTitle={!!texts.navbarTitle}
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <span>Je souhaite protéger</span>
          {selected && <PillInput readOnly value={selectedLabel} placeholder="" inputClassName="min-w-[100px] sm:min-w-[140px]" />}
        </div>
      }
      infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
      canProceed={selected !== null}
      onNext={handleNext}
      selectionError={error}
    >
      {options.map((opt) => (
        <Button key={opt.value} variant="selectOption" size="select" selected={selected === opt.value}
          onClick={() => handleSelect(opt.value as ProtegerValue)} className="justify-between">
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
