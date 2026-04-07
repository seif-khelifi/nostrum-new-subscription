"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSelectionValidation } from "@/hooks/use-selection-validation";
import type { ProfileType } from "@/types/subscription";

export function ProfilStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const texts = useStepTexts("profil");

  const primary = session.beneficiaries[0] as unknown as Record<string, unknown> | undefined;
  const selected = (primary?.quel_est_votre_profil_ as ProfileType) ?? null;

  const options = texts.options!;
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
          <span>Je suis</span>
          {selected && <PillInput readOnly value={selectedLabel} placeholder="" />}
        </div>
      }
      infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
      canProceed={selected !== null}
      onNext={() => { if (validate()) next(); }}
      selectionError={error}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() => updatePrimary({ quel_est_votre_profil_: opt.value as ProfileType })}
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
