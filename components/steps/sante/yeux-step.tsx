"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { YeuxValue } from "@/types/subscription";

const DEFAULT_OPTIONS = [
  { value: "rien", label: "Je n'ai besoin de rien" },
  {
    value: "lunettes_lentilles",
    label: "Je porte des lunettes ou des lentilles",
  },
  { value: "specifique", label: "J'ai besoin de solutions plus spécifiques" },
] as const;

export function YeuxStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSanteForm();
  const texts = useStepTexts("sante_yeux");

  const options = texts?.options ?? DEFAULT_OPTIONS;
  const selected = formData.yeux;

  // Banner: use variant config, fall back to nothing if explicitly null
  const bannerNode =
    texts?.banner === null ? undefined : texts?.banner ? (
      <VariantBanner config={texts.banner} className="mt-2" />
    ) : undefined;

  return (
    <StepScreen
      title={texts?.title}
      canProceed={selected !== null}
      onNext={next}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() => updateFormData({ yeux: opt.value as YeuxValue })}
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

      {bannerNode}
    </StepScreen>
  );
}
