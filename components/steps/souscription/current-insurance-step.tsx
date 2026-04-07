"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  InsuranceSearchInput,
  type InsuranceItem,
  type InsuranceSearchResult,
} from "@/components/ui/search-input";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { PrimaryBeneficiary } from "@/types/subscription";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  currentInsuranceSchema,
  type CurrentInsuranceFormValues,
} from "@/lib/validations/situation";
import insurancesData from "@/data/insurances.json";
import { useState } from "react";

/* ─── Data ─── */

const INSURANCE_LIST: InsuranceItem[] = insurancesData.insurances;

/* ─── Helpers ─── */

function resolveInitialSelection(name?: string): InsuranceSearchResult {
  if (!name) return { item: null, customName: null };
  const found = INSURANCE_LIST.find((m) => m.name === name) ?? null;
  return found
    ? { item: found, customName: null }
    : { item: null, customName: name };
}

/* ─── Component ─── */

export function CurrentInsuranceStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const p = session.beneficiaries[0] as PrimaryBeneficiary | undefined;
  const texts = useStepTexts("currentInsurance");

  /* ── Address form ── */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, submitCount },
  } = useForm<CurrentInsuranceFormValues>({
    resolver: standardSchemaResolver(currentInsuranceSchema),
    defaultValues: {
      insuranceName: p?.previousHealthMutualName ?? "",
      street: p?.previousHealthMutualAddress ?? "",
      complement: "",
      postalCode: "",
      city: "",
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  /* ── Search state ── */
  const [searchResult, setSearchResult] = useState<InsuranceSearchResult>(() =>
    resolveInitialSelection(p?.previousHealthMutualName ?? ""),
  );

  const hasInsurance =
    searchResult.item !== null || searchResult.customName !== null;

  const handleSelect = (result: InsuranceSearchResult) => {
    setSearchResult(result);
    if (result.item) {
      /* Auto-fill address fields from the JSON data */
      setValue("insuranceName", result.item.name);
      setValue("street", result.item.street);
      setValue("postalCode", result.item.postal);
      setValue("city", result.item.city);
    } else if (result.customName) {
      /* Clear address fields so user fills them manually */
      setValue("insuranceName", result.customName);
      setValue("street", "");
      setValue("postalCode", "");
      setValue("city", "");
      setValue("complement", "");
    }
  };

  const handleClear = () => {
    setSearchResult({ item: null, customName: null });
  };

  const onSubmit = (data: CurrentInsuranceFormValues) => {
    updatePrimary({
      previousHealthMutualName:
        searchResult.item?.name ??
        searchResult.customName ??
        data.insuranceName,
      previousHealthMutualAddress: [data.street, data.complement, data.postalCode, data.city].filter(Boolean).join(", "),
    });
    next();
  };

  const canProceed = hasInsurance && isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={texts.subtitle}
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={canProceed}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
      >
        {/* Mutuelle search */}
        <InsuranceSearchInput
          items={INSURANCE_LIST}
          selected={searchResult}
          onSelect={handleSelect}
          onClear={handleClear}
          placeholder="Rechercher une mutuelle..."
        />

        {/* Address fields — shown after selection */}
        {hasInsurance && (
          <div className="flex flex-col gap-3 w-full mt-2">
            <div className="font-semibold text-base sm:text-lg text-[#1D1B20]">
              est domiciliée à l&apos;adresse
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PillInput
                placeholder="Numéro et voie"
                {...register("street")}
                hasError={!!errors.street}
              />
              <PillInput
                placeholder="Complément (optionnel)"
                {...register("complement")}
                hasError={!!errors.complement}
              />
              <PillInput
                placeholder="Code postal"
                {...register("postalCode")}
                hasError={!!errors.postalCode}
              />
              <PillInput
                placeholder="Ville"
                {...register("city")}
                hasError={!!errors.city}
              />
            </div>
          </div>
        )}
      </StepScreen>
    </form>
  );
}
