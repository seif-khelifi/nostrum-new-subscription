"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { InfoIcon } from "lucide-react";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  dateBirthConjointSchema,
  type DateBirthConjointFormValues,
} from "@/lib/validations/situation";

/** Labels matching the commenceParQui step options */
const COMMENCE_LABELS: Record<string, string> = {
  conjoint: "Mon conjoint(e)",
  enfant: "Mon enfant",
};

export function DateBirthConjointStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  const rawBirthDate = formData.conjoint?.birthDate ?? "";
  const commenceLabel = formData.commenceParQui
    ? (COMMENCE_LABELS[formData.commenceParQui] ?? "")
    : "";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DateBirthConjointFormValues>({
    resolver: standardSchemaResolver(dateBirthConjointSchema),
    defaultValues: {
      conjointBirthDate: rawBirthDate ? new Date(rawBirthDate) : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DateBirthConjointFormValues) => {
    updateFormData({
      conjoint: {
        ...formData.conjoint,
        birthDate: data.conjointBirthDate.toISOString(),
      },
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={<>On commence par qui ?</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je veux protéger en premier mon</span>
            <PillInput
              readOnly
              value={commenceLabel}
              placeholder=""
              inputClassName="min-w-[100px] sm:min-w-[140px]"
            />
            <span>et il est né(e) le</span>
            <Controller
              name="conjointBirthDate"
              control={control}
              render={({ field }) => (
                <PillDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="JJ/MM/AAAA"
                  hasError={!!errors.conjointBirthDate}
                  inputClassName="min-w-[120px] sm:min-w-[160px]"
                />
              )}
            />
          </div>
        }
        infoCard={
          <AlertBanner
            variant="info"
            title="Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone."
            subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
            icon={<InfoIcon className="size-5 text-[#9000E3]" />}
          />
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
