"use client";

import { useMemo, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { GeneralErrorDrawer } from "@/components/steps/devis/drawers/general-error-drawer";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSanteForm } from "@/context/SanteFormContext";
import type { PrimaryBeneficiary } from "@/types/subscription";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  formatBirthdate,
  parseBirthdate,
  calculateDatesOfContractsSwap,
} from "@/lib/utils";
import {
  dateDebutNostrumSchema,
  type DateDebutNostrumFormValues,
} from "@/lib/validations/situation";

export function DateDebutNostrumStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const { uiData } = useSanteForm();
  const p = session.beneficiaries[0] as PrimaryBeneficiary | undefined;
  const texts = useStepTexts("dateDebutNostrum");

  const hasOtherInsurance = uiData.resilierMutuelle === "mutuelle_a_resilier";

  /* ── Compute swap dates (M+1 last day, M+2 first day) ── */
  const swapDates = useMemo(() => calculateDatesOfContractsSwap(), []);

  /* ── Determine the default/locked start date ── */
  const defaultDate = useMemo(() => {
    if (hasOtherInsurance) {
      // Locked to M+2 first day
      return parseBirthdate(swapDates.secondNextMonthFirstDay);
    }
    // No insurance: restore from session or default to today
    if (p?.startDate) return parseBirthdate(p.startDate);
    return new Date();
  }, [hasOtherInsurance, swapDates.secondNextMonthFirstDay, p?.startDate]);

  const now = new Date();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DateDebutNostrumFormValues>({
    resolver: standardSchemaResolver(dateDebutNostrumSchema),
    defaultValues: {
      dateDebut: defaultDate,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  /* ── Price recalculation modal state ── */
  const [showPriceModal, setShowPriceModal] = useState(false);
  const pendingDataRef = useRef<DateDebutNostrumFormValues | null>(null);

  /** Persist to session and advance */
  const commitAndAdvance = (data: DateDebutNostrumFormValues) => {
    const startDate = hasOtherInsurance
      ? swapDates.secondNextMonthFirstDay
      : formatBirthdate(data.dateDebut);

    if (hasOtherInsurance) {
      // Previous contract end date = Dec 31 of current year (or next year if contract starts next year)
      const endYear = swapDates.contractStartsNextYear
        ? now.getFullYear() + 1
        : now.getFullYear();
      const previousContractEndDate = `31/12/${endYear}`;

      updatePrimary({
        startDate,
        previousContractEndDate,
        previousContractEndDateAsked: swapDates.previousHealthMutualLastDay,
      });
    } else {
      updatePrimary({
        startDate,
        previousMutualTermination: false,
      });
    }
    next();
  };

  const onSubmit = (data: DateDebutNostrumFormValues) => {
    // Determine the effective start date to check the year
    const effectiveDate = hasOtherInsurance
      ? parseBirthdate(swapDates.secondNextMonthFirstDay)
      : data.dateDebut;

    const startYear = effectiveDate?.getFullYear() ?? now.getFullYear();

    // If the start date is in a future year, show the price recalculation modal
    if (startYear > now.getFullYear()) {
      pendingDataRef.current = data;
      setShowPriceModal(true);
      return;
    }

    commitAndAdvance(data);
  };

  const handlePriceModalConfirm = () => {
    setShowPriceModal(false);
    if (pendingDataRef.current) {
      commitAndAdvance(pendingDataRef.current);
      pendingDataRef.current = null;
    }
  };

  const handlePriceModalCancel = () => {
    setShowPriceModal(false);
    pendingDataRef.current = null;
  };

  /** The year shown in the modal message */
  const modalYear = (() => {
    const effectiveDate = hasOtherInsurance
      ? parseBirthdate(swapDates.secondNextMonthFirstDay)
      : undefined;
    return effectiveDate?.getFullYear() ?? now.getFullYear() + 1;
  })();

  /* ── Gender-aware info message for coverage transition ── */
  const gender = p?.gender;
  const coverageText = gender === "F" ? "couverte" : "couvert";

  /* ── Info message below the date picker ── */
  const infoMessage = hasOtherInsurance
    ? `En cas de résiliation, la date de souscription est automatiquement fixée au 1er du mois (${swapDates.secondNextMonthFirstDay}).`
    : "Je peux être couvert dès aujourd'hui !";

  /* ── Coverage transition banner (only when has insurance + previousContractStartDate set) ── */
  const showTransitionBanner =
    hasOtherInsurance && p?.previousContractStartDate;

  const transitionMessage = showTransitionBanner
    ? `Je suis ${coverageText} jusqu'au ${swapDates.previousHealthMutualLastDay} par ${p?.previousHealthMutualName ?? "ma mutuelle"} et je serai ${coverageText} à partir du ${swapDates.secondNextMonthFirstDay} chez Nostrum Care`
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span>Je veux débuter mon contrat Nostrum Care le</span>
              <Controller
                name="dateDebut"
                control={control}
                render={({ field }) => (
                  <PillDatePicker
                    value={hasOtherInsurance ? defaultDate : field.value}
                    onChange={
                      hasOtherInsurance ? undefined : field.onChange
                    }
                    placeholder="JJ/MM/AAAA"
                    hasError={!!errors.dateDebut}
                    inputClassName={`min-w-[120px] sm:min-w-[160px] ${hasOtherInsurance ? "cursor-not-allowed opacity-50" : ""}`}
                    fromYear={now.getFullYear()}
                    toYear={now.getFullYear() + 100}
                  />
                )}
              />
            </div>
            <p className="text-sm font-normal text-[#490076]/80">
              {infoMessage}
            </p>
          </div>
        }
        infoCard={
          transitionMessage ? (
            <AlertBanner
              variant="info"
              title={transitionMessage}
              icon
            />
          ) : texts.banner ? (
            <AlertBanner {...texts.banner} />
          ) : undefined
        }
        canProceed={isValid}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
      >
        {/* No additional children — form is in subtitle */}
        <></>
      </StepScreen>

      {/* ── Price recalculation modal ── */}
      <GeneralErrorDrawer
        open={showPriceModal}
        onOpenChange={(open) => {
          if (!open) handlePriceModalCancel();
        }}
        title="Recalcul du tarif"
        message={`Le tarif est recalculé automatiquement car la date d'effet choisie est en ${modalYear}. Votre âge à cette date peut faire légèrement varier le montant de la cotisation.`}
        showCallButton={false}
        onAction={handlePriceModalConfirm}
        actionLabel="Continuer"
        dismissLabel="Annuler"
      />
    </form>
  );
}
