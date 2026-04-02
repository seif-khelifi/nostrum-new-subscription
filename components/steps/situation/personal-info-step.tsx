"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
  ADHERENT_MIN_AGE,
  ADHERENT_MAX_AGE,
} from "@/lib/validations/situation";

export function PersonalInfoStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("personalInfo");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<PersonalInfoFormValues>({
    resolver: standardSchemaResolver(personalInfoSchema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: PersonalInfoFormValues) => {
    updateFormData({
      firstName: data.firstName,
      lastName: data.lastName,
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
            <span>Je m&apos;appelle</span>
            <PillInput
              placeholder="Prénom"
              {...register("firstName")}
              hasError={!!errors.firstName}
            />
            <PillInput
              placeholder="Nom"
              {...register("lastName")}
              hasError={!!errors.lastName}
            />
            <span>, née le</span>
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
          texts.banner ? <VariantBanner config={texts.banner} /> : undefined
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
