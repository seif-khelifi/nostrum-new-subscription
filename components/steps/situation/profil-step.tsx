"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { ProfilValue } from "@/types/subscription";

const OPTIONS = [
  { value: "salarie", label: "Salarié(e)" },
  { value: "independant_tns", label: "Indépendant(e) /TNS" },
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "independant", label: "Indépendant(e)" },
  { value: "retraite", label: "Retraité(e)" },
  { value: "recherche_emploi", label: "En recherche d'emploi" },
] as const;

export function ProfilStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  const selected = formData.profil;

  const selectedLabel = selected
    ? (OPTIONS.find((o) => o.value === selected)?.label ?? "")
    : "";

  return (
    <StepScreen
      title="Votre situation pro ?"
      subtitle={
        <div className="flex flex-wrap items-center gap-2">
          <span>Je suis</span>
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
      onNext={next}
    >
      {OPTIONS.map((opt) => (
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
