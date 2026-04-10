"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { PrimaryBeneficiary } from "@/types/subscription";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { formatBirthdate, parseBirthdate } from "@/lib/utils";
import {
  dateSignatureAncienSchema,
  type DateSignatureAncienFormValues,
} from "@/lib/validations/situation";

export function DateSignatureAncienStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const p = session.beneficiaries[0] as PrimaryBeneficiary | undefined;
  const texts = useStepTexts("dateSignatureAncien");

  const now = new Date();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DateSignatureAncienFormValues>({
    resolver: standardSchemaResolver(dateSignatureAncienSchema),
    defaultValues: {
      dateSignature: p?.previousContractStartDate
        ? parseBirthdate(p.previousContractStartDate)
        : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DateSignatureAncienFormValues) => {
    updatePrimary({
      previousContractStartDate: formatBirthdate(data.dateSignature),
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
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
                  fromYear={now.getFullYear() - 30}
                  toYear={now.getFullYear()}
                />
              )}
            />
          </div>
        }
        infoCard={
          texts.banner ? <AlertBanner {...texts.banner} /> : undefined
        }
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
