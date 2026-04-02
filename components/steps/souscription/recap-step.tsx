"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { PhoneInput } from "@/components/ui/phone-input";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  recapSchema,
  type RecapFormValues,
  ADHERENT_MIN_AGE,
  ADHERENT_MAX_AGE,
} from "@/lib/validations/situation";

export function RecapStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("recap");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<RecapFormValues>({
    resolver: standardSchemaResolver(recapSchema),
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      email: formData.email || "",
      phone: formData.phone || "",
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: RecapFormValues) => {
    updateFormData({
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate.toISOString(),
      email: data.email,
      phone: data.phone,
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        subtitle={texts.subtitle}
        infoCard={
          texts.banner ? <VariantBanner config={texts.banner} /> : undefined
        }
        canProceed={isValid}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
      >
        {/* Continuous line form with inline editable fields */}
        <div className="flex flex-wrap items-center gap-2 font-semibold text-base sm:text-lg text-[#1D1B20]">
          <span>Mes informations sont exactes :</span>
          <br />
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
                  fromYear={now.getFullYear() - ADHERENT_MAX_AGE}
                  toYear={now.getFullYear() - ADHERENT_MIN_AGE}
                />
              );
            }}
          />
          <PillInput
            type="email"
            placeholder="votre@email.com"
            {...register("email")}
            hasError={!!errors.email}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                placeholder="06 12 34 56 78"
                hasError={!!errors.phone}
                defaultCountry="FR"
              />
            )}
          />
        </div>
      </StepScreen>
    </form>
  );
}
