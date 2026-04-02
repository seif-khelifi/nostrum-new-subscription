"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillCombobox } from "@/components/ui/pill-combobox";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  birthPlaceSchema,
  type BirthPlaceFormValues,
} from "@/lib/validations/situation";
import citiesData from "@/data/cities.json";

/* ─── Pre-process: deduplicate & title-case city names (runs once at module load) ─── */

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|-)\S/g, (match) => match.toUpperCase());
}

const ALL_CITIES: string[] = [
  ...new Set(citiesData.cities.map((c) => toTitleCase(c.nom_de_la_commune))),
].sort();

const MAX_SUGGESTIONS = 50;

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

  const [citySearch, setCitySearch] = useState("");

  const filteredCities = useMemo(() => {
    const query = citySearch.trim().toLowerCase();
    if (!query) return ALL_CITIES.slice(0, MAX_SUGGESTIONS);
    return ALL_CITIES.filter((city) =>
      city.toLowerCase().startsWith(query),
    ).slice(0, MAX_SUGGESTIONS);
  }, [citySearch]);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
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
                    options={filteredCities}
                    value={field.value}
                    onValueChange={field.onChange}
                    onInputValueChange={setCitySearch}
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
