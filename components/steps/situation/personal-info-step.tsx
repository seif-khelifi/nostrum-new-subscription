"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
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
  const { session, updatePrimary } = useSituationForm();
  const texts = useStepTexts("personalInfo");
  const p = session.beneficiaries[0];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<PersonalInfoFormValues>({
    resolver: standardSchemaResolver(personalInfoSchema),
    defaultValues: {
      firstname: p?.firstname ?? "",
      lastname: p?.lastname ?? "",
      birthdate: p?.birthdate ? new Date(p.birthdate) : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: PersonalInfoFormValues) => {
    updatePrimary({
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: data.birthdate.toISOString(),
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
            <span>Je m&apos;appelle</span>
            <PillInput placeholder="Prénom" {...register("firstname")} hasError={!!errors.firstname} />
            <PillInput placeholder="Nom" {...register("lastname")} hasError={!!errors.lastname} />
            <span>, née le</span>
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
                    inputClassName="min-w-[120px] sm:min-w-[160px]"
                    fromYear={now.getFullYear() - ADHERENT_MAX_AGE}
                    toYear={now.getFullYear() - ADHERENT_MIN_AGE}
                  />
                );
              }}
            />
          </div>
        }
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
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
