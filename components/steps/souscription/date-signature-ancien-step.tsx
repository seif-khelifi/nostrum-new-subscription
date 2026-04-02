"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  dateSignatureAncienSchema,
  type DateSignatureAncienFormValues,
} from "@/lib/validations/situation";

export function DateSignatureAncienStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("dateSignatureAncien");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DateSignatureAncienFormValues>({
    resolver: standardSchemaResolver(dateSignatureAncienSchema),
    defaultValues: {
      dateSignature: formData.dateSignatureAncienContrat
        ? new Date(formData.dateSignatureAncienContrat)
        : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DateSignatureAncienFormValues) => {
    updateFormData({
      dateSignatureAncienContrat: data.dateSignature.toISOString(),
    });
    next();
  };

  // Banner: use variant config, fall back to nothing if explicitly null
  const bannerNode =
    texts?.banner === null ? undefined : texts?.banner ? (
      <VariantBanner config={texts.banner} />
    ) : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts?.title ?? <>Mes infos d&apos;assurance</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>J&apos;ai signé mon ancien contrat le</span>
            <Controller
              name="dateSignature"
              control={control}
              render={({ field }) => (
                <PillDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="JJ/MM/AAAA"
                  hasError={!!errors.dateSignature}
                  inputClassName="min-w-[120px] sm:min-w-[160px]"
                />
              )}
            />
          </div>
        }
        infoCard={bannerNode}
        canProceed={isValid}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
      >
        {/* No additional children — form is in subtitle */}
        <></>
      </StepScreen>
    </form>
  );
}
