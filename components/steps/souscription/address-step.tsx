"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ChevronRight } from "lucide-react";
import { AddressSearchInput } from "@/components/ui/search-input";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  addressSchema,
  addressSearchSchema,
  type AddressFormValues,
  type AddressSearchFormValues,
} from "@/lib/validations/situation";
import { parseSelectedAddress } from "@/lib/geo";

/* ─── Component ─── */

export function AddressStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("address");
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [apiError, setApiError] = useState(false);

  const handleApiError = useCallback(() => {
    setApiError(true);
  }, []);

  /* ── Search form ── */
  const searchForm = useForm<AddressSearchFormValues>({
    resolver: standardSchemaResolver(addressSearchSchema),
    defaultValues: { fulltext: "" },
    mode: "onSubmit",
  });

  const searchErrors = searchForm.formState.errors;

  useFormErrorToast(
    searchErrors,
    errorKey(searchErrors),
    searchForm.formState.submitCount,
  );

  const selectedFulltext = searchForm.watch("fulltext");

  const onSelect = useCallback(
    (fulltext: string) => {
      searchForm.setValue("fulltext", fulltext, { shouldValidate: true });
    },
    [searchForm],
  );

  const onClear = useCallback(() => {
    searchForm.setValue("fulltext", "", { shouldValidate: false });
  }, [searchForm]);

  const onSearchSubmit = (data: AddressSearchFormValues) => {
    const parsed = parseSelectedAddress(data.fulltext);
    if (!parsed) return;

    updateFormData({
      addressStreet: parsed.street,
      addressComplement: "",
      addressPostalCode: parsed.zipcode,
      addressCity: parsed.city,
    });
    next();
  };

  /* ── Manual form ── */
  const manualForm = useForm<AddressFormValues>({
    resolver: standardSchemaResolver(addressSchema),
    defaultValues: {
      street: formData.addressStreet,
      complement: formData.addressComplement,
      postalCode: formData.addressPostalCode,
      city: formData.addressCity,
    },
    mode: "onTouched",
  });

  useFormErrorToast(
    manualForm.formState.errors,
    errorKey(manualForm.formState.errors),
    manualForm.formState.submitCount,
  );

  const onManualSubmit = (data: AddressFormValues) => {
    updateFormData({
      addressStreet: data.street,
      addressComplement: data.complement ?? "",
      addressPostalCode: data.postalCode,
      addressCity: data.city,
    });
    next();
  };

  const bannerNode = texts.banner ? (
    <AlertBanner {...texts.banner} />
  ) : undefined;

  /* ═══════════ Search mode ═══════════ */
  if (mode === "search") {
    return (
      <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} noValidate>
        <StepScreen
          title={texts.title}
          subtitle={
            <div className="flex flex-wrap items-center gap-2">
              <span>J&apos;habite au</span>
            </div>
          }
          infoCard={bannerNode}
          canProceed={searchForm.formState.isValid}
          onNext={() => searchForm.handleSubmit(onSearchSubmit)()}
          isForm
          errors={searchErrors}
        >
          <div className="w-full self-stretch flex flex-col gap-2">
            <AddressSearchInput
              selected={selectedFulltext}
              onSelect={onSelect}
              onClear={onClear}
              onError={handleApiError}
              wrapperClassName="w-full"
            />

            {(!!searchErrors.fulltext || apiError) && (
              <button
                type="button"
                onClick={() => setMode("manual")}
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#490076] transition-all hover:opacity-80 active:scale-95 active:opacity-60"
              >
                Renseigner manuellement
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </StepScreen>
      </form>
    );
  }

  /* ═══════════ Manual mode ═══════════ */
  return (
    <form onSubmit={manualForm.handleSubmit(onManualSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>J&apos;habite au</span>
            <PillInput
              placeholder="Numéro et voie"
              {...manualForm.register("street")}
              hasError={!!manualForm.formState.errors.street}
            />
            <PillInput
              placeholder="Complément (optionnel)"
              {...manualForm.register("complement")}
              hasError={!!manualForm.formState.errors.complement}
            />
            <PillInput
              placeholder="Code postal"
              {...manualForm.register("postalCode")}
              hasError={!!manualForm.formState.errors.postalCode}
            />
            <PillInput
              placeholder="Ville"
              {...manualForm.register("city")}
              hasError={!!manualForm.formState.errors.city}
            />
          </div>
        }
        infoCard={bannerNode}
        canProceed={manualForm.formState.isValid}
        onNext={() => manualForm.handleSubmit(onManualSubmit)()}
        isForm
        errors={manualForm.formState.errors}
      >
        <button
          type="button"
          onClick={() => setMode("search")}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#490076] transition-all hover:opacity-80 active:scale-95 active:opacity-60"
        >
          Rechercher une adresse
          <ChevronRight className="h-4 w-4" />
        </button>
      </StepScreen>
    </form>
  );
}
