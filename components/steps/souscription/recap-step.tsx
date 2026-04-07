"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { PhoneInput } from "@/components/ui/phone-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { PrimaryBeneficiary } from "@/types/subscription";
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
  const { session, updatePrimary } = useSituationForm();
  const p = session.beneficiaries[0] as PrimaryBeneficiary | undefined;
  const texts = useStepTexts("recap");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<RecapFormValues>({
    resolver: standardSchemaResolver(recapSchema),
    defaultValues: {
      firstname: p?.firstname ?? "",
      lastname: p?.lastname ?? "",
      birthdate: p?.birthdate ? new Date(p.birthdate) : undefined,
      email: p?.email ?? "",
      phone: p?.phone ?? "",
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: RecapFormValues) => {
    updatePrimary({
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: data.birthdate.toISOString(),
      email: data.email,
      phone: data.phone,
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={texts.subtitle}
        infoCard={
          texts.banner ? <AlertBanner {...texts.banner} /> : undefined
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
            {...register("firstname")}
            hasError={!!errors.firstname}
          />
          <PillInput
            placeholder="Nom"
            {...register("lastname")}
            hasError={!!errors.lastname}
          />
          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => {
              const now = new Date();
              return (
                <PillDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="JJ/MM/AAAA"
                  hasError={!!errors.birthdate}
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
