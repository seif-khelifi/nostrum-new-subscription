"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  dateDebutNostrumSchema,
  type DateDebutNostrumFormValues,
} from "@/lib/validations/situation";

export function DateDebutNostrumStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DateDebutNostrumFormValues>({
    resolver: standardSchemaResolver(dateDebutNostrumSchema),
    defaultValues: {
      dateDebut: formData.dateDebutContratNostrum
        ? new Date(formData.dateDebutContratNostrum)
        : undefined,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DateDebutNostrumFormValues) => {
    updateFormData({
      dateDebutContratNostrum: data.dateDebut.toISOString(),
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={<>Mes infos d&apos;assurance</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je veux débuter mon contrat Nostrum Care le</span>
            <Controller
              name="dateDebut"
              control={control}
              render={({ field }) => (
                <PillDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="JJ/MM/AAAA"
                  hasError={!!errors.dateDebut}
                  inputClassName="min-w-[120px] sm:min-w-[160px]"
                />
              )}
            />
          </div>
        }
        infoCard={
          <AlertBanner
            title="Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone."
            subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
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
