"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import type { DentsValue } from "@/types/subscription";

export function DentsStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSanteForm();
  const texts = useStepTexts("sante_dents");

  const options = texts.options!;
  const selected = formData.dents;

  const bannerNode =
    texts.banner === null ? undefined : texts.banner ? (
      <VariantBanner config={texts.banner} className="mt-2" />
    ) : undefined;

  return (
    <StepScreen
      title={texts.title}
      canProceed={selected !== null}
      onNext={next}
    >
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="selectOption"
          size="select"
          selected={selected === opt.value}
          onClick={() => updateFormData({ dents: opt.value as DentsValue })}
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
