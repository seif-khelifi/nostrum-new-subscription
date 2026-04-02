"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  nousSommesSchema,
  type NousSommesFormValues,
} from "@/lib/validations/situation";

/** Labels matching the proteger step options */
const PROTEGER_LABELS: Record<string, string> = {
  moi: "Seulement moi",
  conjoint_et_moi: "Mon conjoint(e) et moi",
  enfants_et_moi: "Mes enfants et moi",
  famille: "Toute ma famille",
};

export function NousSommesStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("nousSommes");

  const protegerLabel = formData.proteger
    ? (PROTEGER_LABELS[formData.proteger] ?? "")
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<NousSommesFormValues>({
    resolver: standardSchemaResolver(nousSommesSchema),
    defaultValues: {
      familyCount: formData.familyCount ?? (undefined as unknown as number),
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: NousSommesFormValues) => {
    updateFormData({ familyCount: data.familyCount });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts?.title ?? <>Qui souhaitez-vous protéger ?</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je souhaite protéger</span>
            <PillInput readOnly value={protegerLabel} placeholder="" />
            <span>, nous sommes</span>
            <PillInput
              type="number"
              min={2}
              placeholder="2"
              {...register("familyCount", { valueAsNumber: true })}
              hasError={!!errors.familyCount}
            />
          </div>
        }
        infoCard={
          texts?.banner ? <VariantBanner config={texts.banner} /> : undefined
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
