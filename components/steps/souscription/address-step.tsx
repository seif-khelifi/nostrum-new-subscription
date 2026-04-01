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
  addressSchema,
  type AddressFormValues,
} from "@/lib/validations/situation";

/* ─── Address suggestion type ─── */

interface AddressSuggestion {
  label: string;
  street: string;
  postalCode: string;
  city: string;
}

/* ─── Hardcoded examples (shown when search is empty) ─── */

const EXAMPLE_SUGGESTIONS: AddressSuggestion[] = [
  {
    label: "12 Rue de Rivoli, 75001 Paris",
    street: "12 Rue de Rivoli",
    postalCode: "75001",
    city: "Paris",
  },
  {
    label: "45 Avenue des Champs-Élysées, 75008 Paris",
    street: "45 Avenue des Champs-Élysées",
    postalCode: "75008",
    city: "Paris",
  },
  {
    label: "8 Boulevard Haussmann, 75009 Paris",
    street: "8 Boulevard Haussmann",
    postalCode: "75009",
    city: "Paris",
  },
  {
    label: "22 Rue du Faubourg Saint-Honoré, 75008 Paris",
    street: "22 Rue du Faubourg Saint-Honoré",
    postalCode: "75008",
    city: "Paris",
  },
  {
    label: "5 Rue de la République, 69002 Lyon",
    street: "5 Rue de la République",
    postalCode: "69002",
    city: "Lyon",
  },
  {
    label: "18 Cours Mirabeau, 13100 Aix-en-Provence",
    street: "18 Cours Mirabeau",
    postalCode: "13100",
    city: "Aix-en-Provence",
  },
  {
    label: "27 Rue Sainte-Catherine, 33000 Bordeaux",
    street: "27 Rue Sainte-Catherine",
    postalCode: "33000",
    city: "Bordeaux",
  },
  {
    label: "14 Rue Foch, 34000 Montpellier",
    street: "14 Rue Foch",
    postalCode: "34000",
    city: "Montpellier",
  },
  {
    label: "9 Rue de Metz, 31000 Toulouse",
    street: "9 Rue de Metz",
    postalCode: "31000",
    city: "Toulouse",
  },
  {
    label: "3 Place Masséna, 06000 Nice",
    street: "3 Place Masséna",
    postalCode: "06000",
    city: "Nice",
  },
];

/* ─── Component ─── */

export function AddressStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  /* ── Mode toggle ── */
  const [mode, setMode] = useState<"search" | "manual">("search");

  /* ── Search state ── */
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return [];

    return EXAMPLE_SUGGESTIONS.filter((addr) =>
      `${addr.label} ${addr.street} ${addr.postalCode} ${addr.city}`
        .toLowerCase()
        .includes(trimmed),
    );
  }, [query]);

  const selectedAddress = suggestions.find((s) => s.label === selected) ?? null;

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelected(null);
  };

  const handleSelectAddress = (addr: AddressSuggestion) => {
    setSelected(addr.label);
  };

  const handleSearchNext = () => {
    if (!selected || !selectedAddress) return;

    updateFormData({
      addressStreet: selectedAddress.street,
      addressComplement: "",
      addressPostalCode: selectedAddress.postalCode,
      addressCity: selectedAddress.city,
    });
    next();
  };

  /* ── Manual form ── */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<AddressFormValues>({
    resolver: standardSchemaResolver(addressSchema),
    defaultValues: {
      street: formData.addressStreet,
      complement: formData.addressComplement,
      postalCode: formData.addressPostalCode,
      city: formData.addressCity,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onManualSubmit = (data: AddressFormValues) => {
    updateFormData({
      addressStreet: data.street,
      addressComplement: data.complement ?? "",
      addressPostalCode: data.postalCode,
      addressCity: data.city,
    });
    next();
  };

  /* ═══════════ Search mode ═══════════ */
  if (mode === "search") {
    return (
      <StepScreen
        title={<>Mes infos personnelles</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>J&apos;habite au</span>
          </div>
        }
        canProceed={selectedAddress !== null}
        onNext={handleSearchNext}
      >
        <SearchInput
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher une adresse..."
        />

        {suggestions.map((addr, i) => (
          <Button
            key={`${addr.label}-${i}`}
            variant="selectOption"
            size="select"
            selected={selected === addr.label}
            onClick={() => handleSelectAddress(addr)}
            className="justify-between max-w-[calc(100vw-2rem)] sm:max-w-none whitespace-normal text-left h-auto min-h-10 sm:min-h-12 py-2.5"
          >
            <span className="min-w-0">{addr.label}</span>
            {selected === addr.label && (
              <span className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#490076] text-white">
                <Check className="size-3 sm:size-3.5" />
              </span>
            )}
          </Button>
        ))}

        <button
          type="button"
          onClick={() => setMode("manual")}
          className="mt-1 text-sm font-medium text-[#9000E3] underline underline-offset-2 hover:text-[#7a00c4] transition-colors"
        >
          Renseigner manuellement
        </button>
      </StepScreen>
    );
  }

  /* ═══════════ Manual mode ═══════════ */
  return (
    <form onSubmit={handleSubmit(onManualSubmit)} noValidate>
      <StepScreen
        title={<>Mes infos personnelles</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>J&apos;habite au</span>
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
        }
        canProceed={isValid}
        onNext={() => handleSubmit(onManualSubmit)()}
        isForm
        errors={errors}
      >
        <button
          type="button"
          onClick={() => setMode("search")}
          className="text-sm font-medium text-[#9000E3] underline underline-offset-2 hover:text-[#7a00c4] transition-colors"
        >
          Rechercher une adresse
        </button>
      </StepScreen>
    </form>
  );
}
