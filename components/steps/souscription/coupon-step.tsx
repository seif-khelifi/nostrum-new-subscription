"use client";

import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useApiError } from "@/hooks/use-api-error";
import { validateCoupon } from "@/lib/coupon-api";

export function CouponStep() {
  const { next } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("coupon");

  const { error, showError, clearError } = useApiError();
  const [code, setCode] = useState(session.coupon?.code ?? "");
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(!!session.coupon);
  const [description, setDescription] = useState<string | null>(null);

  const hasInput = code.trim().length > 0;

  async function handleValidate() {
    if (!hasInput || validated) return;
    clearError();
    setValidating(true);
    try {
      const coupon = await validateCoupon(code.trim());
      updateSession({ coupon: { code: code.trim(), id: coupon.id } });
      setDescription(coupon.description);
      setValidated(true);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setValidating(false);
    }
  }

  function handleReset() {
    setCode("");
    setValidated(false);
    setDescription(null);
    updateSession({ coupon: undefined });
    clearError();
  }

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
      subtitle={texts.subtitle}
      infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
      canProceed
      onNext={next}
      selectionError={error}
      customAction={
        <Button variant="ctaPurple" size="cta" onClick={next}>
          {hasInput ? "Continuer" : "Continuer sans code promo"}
          <ArrowRight className="size-5" />
        </Button>
      }
    >
      <div className="flex w-full max-w-xl flex-col gap-3">
        {/* Inline phrase with input */}
        <div className="flex flex-wrap items-center gap-2 font-semibold text-base sm:text-lg text-[#1D1B20]">
          <span>Mon code promo est</span>
          <div className="flex items-center gap-2">
            <PillInput
              placeholder="PROMO"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                clearError();
                if (validated) {
                  setValidated(false);
                  setDescription(null);
                  updateSession({ coupon: undefined });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleValidate();
                }
              }}
              disabled={validated}
              hasError={!!error}
            />
            {validated ? (
              <Button
                type="button"
                variant="selectOption"
                size="select"
                className="shrink-0"
                onClick={handleReset}
              >
                <RotateCcw className="size-4" />
                Modifier
              </Button>
            ) : (
              <Button
                type="button"
                variant="ctaPurple"
                size="cta"
                className="shrink-0"
                onClick={handleValidate}
                loading={validating}
                disabled={!hasInput}
              >
                Valider
              </Button>
            )}
          </div>
        </div>

        {validated && description && (
          <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            <Check className="mt-0.5 size-4 shrink-0" />
            <span>{description}</span>
          </div>
        )}
      </div>
    </StepScreen>
  );
}
