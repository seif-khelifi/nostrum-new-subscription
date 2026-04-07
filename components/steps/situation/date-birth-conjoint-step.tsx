"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { dateBirthConjointSchema, type DateBirthConjointFormValues, CONJOINT_MIN_AGE, CONJOINT_MAX_AGE } from "@/lib/validations/situation";

const COMMENCE_LABELS: Record<string, string> = { conjoint: "Mon conjoint(e)", enfant: "Mon enfant" };

export function DateBirthConjointStep() {
  const { next } = useStepper();
  const { session, updateBeneficiary } = useSituationForm();
  const { uiData } = useSanteForm();
  const texts = useStepTexts("dateBirthConjoint");

  const marriedIdx = session.beneficiaries.findIndex((b) => b.relationship === "MARRIED");
  const married = marriedIdx >= 0 ? session.beneficiaries[marriedIdx] : null;
  const rawBirthDate = married?.birthdate ?? "";
  const commenceLabel = uiData.commenceParQui ? (COMMENCE_LABELS[uiData.commenceParQui] ?? "") : "";

  const {
    control, handleSubmit, formState: { errors, isValid, submitCount },
  } = useForm<DateBirthConjointFormValues>({
    resolver: standardSchemaResolver(dateBirthConjointSchema),
    defaultValues: { conjointBirthDate: rawBirthDate ? new Date(rawBirthDate) : undefined },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DateBirthConjointFormValues) => {
    if (marriedIdx >= 0) updateBeneficiary(marriedIdx, { birthdate: data.conjointBirthDate.toISOString() });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title} hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je veux protéger en premier mon</span>
            <PillInput readOnly value={commenceLabel} placeholder="" inputClassName="min-w-[100px] sm:min-w-[140px]" />
            <span>et il est né(e) le</span>
            <Controller name="conjointBirthDate" control={control} render={({ field }) => {
              const now = new Date();
              return (<PillDatePicker value={field.value} onChange={field.onChange} placeholder="JJ/MM/AAAA" hasError={!!errors.conjointBirthDate} inputClassName="min-w-[120px] sm:min-w-[160px]" fromYear={now.getFullYear() - CONJOINT_MAX_AGE} toYear={now.getFullYear() - CONJOINT_MIN_AGE} />);
            }} />
          </div>
        }
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={isValid} onNext={() => handleSubmit(onSubmit)()} isForm errors={errors}
      ><></></StepScreen>
    </form>
  );
}
