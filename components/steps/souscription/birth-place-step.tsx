"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillCombobox } from "@/components/ui/pill-combobox";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  birthPlaceSchema,
  type BirthPlaceFormValues,
} from "@/lib/validations/situation";

/* ─── Hardcoded French cities for combobox ─── */

const FRENCH_CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Saint-Étienne",
  "Toulon",
  "Le Havre",
  "Grenoble",
  "Dijon",
  "Angers",
  "Nîmes",
  "Aix-en-Provence",
];

/* ─── Helper ─── */

function isFrance(country: string | undefined): boolean {
  if (!country) return false;
  return country.trim().toLowerCase() === "france";
}

/* ─── Component ─── */

export function BirthPlaceStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("birthPlace");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, submitCount },
  } = useForm<BirthPlaceFormValues>({
    resolver: standardSchemaResolver(birthPlaceSchema),
    defaultValues: {
      birthCountry: formData.birthCountry,
      birthCity: formData.birthCity,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const country = watch("birthCountry");

  const onSubmit = (data: BirthPlaceFormValues) => {
    updateFormData({
      birthCountry: data.birthCountry,
      birthCity: data.birthCity,
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
        title={texts?.title ?? <>Mes infos personnelles</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je suis né(e) en</span>
            <PillInput
              placeholder="Pays"
              {...register("birthCountry")}
              hasError={!!errors.birthCountry}
            />
            <span>à</span>
            {isFrance(country) ? (
              <Controller
                name="birthCity"
                control={control}
                render={({ field }) => (
                  <PillCombobox
                    options={FRENCH_CITIES}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Ville"
                    hasError={!!errors.birthCity}
                  />
                )}
              />
            ) : (
              <PillInput
                placeholder="Ville"
                {...register("birthCity")}
                hasError={!!errors.birthCity}
              />
            )}
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
