"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  dobSchema,
  type DobFormValues,
  ADHERENT_MIN_AGE,
  ADHERENT_MAX_AGE,
} from "@/lib/validations/situation";

export function DobStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("dob");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DobFormValues>({
    resolver: standardSchemaResolver(dobSchema),
    defaultValues: {
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DobFormValues) => {
    updateFormData({
      birthDate: data.birthDate.toISOString(),
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je suis né le</span>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => {
                const now = new Date();
                return (
                  <PillDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="JJ/MM/AAAA"
                    hasError={!!errors.birthDate}
                    inputClassName="min-w-[120px] sm:min-w-[160px]"
                    fromYear={now.getFullYear() - ADHERENT_MAX_AGE}
                    toYear={now.getFullYear() - ADHERENT_MIN_AGE}
                  />
                );
              }}
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
        <></>
      </StepScreen>
    </form>
  );
}
