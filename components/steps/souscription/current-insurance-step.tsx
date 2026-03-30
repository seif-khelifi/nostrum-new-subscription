"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  currentInsuranceSchema,
  type CurrentInsuranceFormValues,
} from "@/lib/validations/situation";

/* ─── Hardcoded mutuelle list ─── */

interface MutuelleSuggestion {
  name: string;
}

const MUTUELLE_LIST: MutuelleSuggestion[] = [
  { name: "Harmonie Mutuelle" },
  { name: "MGEN" },
  { name: "Malakoff Humanis" },
  { name: "AG2R La Mondiale" },
  { name: "Groupama" },
  { name: "MAIF" },
  { name: "Macif" },
  { name: "MMA" },
  { name: "Allianz" },
  { name: "Axa" },
  { name: "Swiss Life" },
  { name: "Generali" },
  { name: "CNP Assurances" },
  { name: "Crédit Agricole Assurances" },
  { name: "Mutex" },
  { name: "Klesia" },
  { name: "Apicil" },
  { name: "Covéa" },
  { name: "Matmut" },
  { name: "Sogécap" },
  { name: "Ociane Vitality" },
  { name: "Alan" },
  { name: "April" },
  { name: "Néoliane" },
];

/* ─── Component ─── */

export function CurrentInsuranceStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  /* ── Search state ── */
  const [query, setQuery] = useState("");
  const [selectedMutuelle, setSelectedMutuelle] = useState<string | null>(
    formData.currentInsuranceName || null,
  );

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return MUTUELLE_LIST.filter((m) => m.name.toLowerCase().includes(trimmed));
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedMutuelle(null);
  };

  const handleSelectMutuelle = (name: string) => {
    setSelectedMutuelle(name);
  };

  /* ── Address form ── */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<CurrentInsuranceFormValues>({
    resolver: standardSchemaResolver(currentInsuranceSchema),
    defaultValues: {
      insuranceName: formData.currentInsuranceName,
      street: formData.currentInsuranceStreet,
      complement: formData.currentInsuranceComplement,
      postalCode: formData.currentInsurancePostalCode,
      city: formData.currentInsuranceCity,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: CurrentInsuranceFormValues) => {
    updateFormData({
      currentInsuranceName: selectedMutuelle ?? data.insuranceName,
      currentInsuranceStreet: data.street,
      currentInsuranceComplement: data.complement ?? "",
      currentInsurancePostalCode: data.postalCode,
      currentInsuranceCity: data.city,
    });
    next();
  };

  const canProceed = selectedMutuelle !== null && isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={<>Mes infos d&apos;assurance</>}
        subtitle={<span>Ma mutuelle actuelle</span>}
        canProceed={canProceed}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
      >
        {/* Mutuelle search */}
        <SearchInput
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher une mutuelle..."
        />

        {suggestions.map((m, i) => (
          <Button
            key={`${m.name}-${i}`}
            type="button"
            variant="selectOption"
            size="select"
            selected={selectedMutuelle === m.name}
            onClick={() => handleSelectMutuelle(m.name)}
            className="justify-between"
          >
            <span>{m.name}</span>
            {selectedMutuelle === m.name && (
              <span className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#490076] text-white">
                <Check className="size-3 sm:size-3.5" />
              </span>
            )}
          </Button>
        ))}

        {/* Address fields — shown below the search */}
        {selectedMutuelle && (
          <div className="flex flex-col gap-3 w-full mt-2">
            <div className="font-semibold text-base sm:text-lg text-[#1D1B20]">
              est domiciliée à l&apos;adresse
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PillInput
                placeholder="Numéro et voie"
                {...register("street")}
                hasError={!!errors.street}
                inputClassName="min-w-[180px] sm:min-w-[260px]"
              />
              <PillInput
                placeholder="Complément (optionnel)"
                {...register("complement")}
                hasError={!!errors.complement}
                inputClassName="min-w-[180px] sm:min-w-[240px]"
              />
              <PillInput
                placeholder="Code postal"
                {...register("postalCode")}
                hasError={!!errors.postalCode}
                inputClassName="min-w-[100px] sm:min-w-[130px]"
              />
              <PillInput
                placeholder="Ville"
                {...register("city")}
                hasError={!!errors.city}
                inputClassName="min-w-[120px] sm:min-w-[180px]"
              />
            </div>
          </div>
        )}
      </StepScreen>
    </form>
  );
}
