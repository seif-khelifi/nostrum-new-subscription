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
import { mailSchema, type MailFormValues } from "@/lib/validations/situation";

export function MailStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("mail");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<MailFormValues>({
    resolver: standardSchemaResolver(mailSchema),
    defaultValues: {
      email: formData.email,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: MailFormValues) => {
    updateFormData({ email: data.email });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>
              {"Je souhaite recevoir un devis personnalisé à l'adresse"}
            </span>
            <PillInput
              type="email"
              placeholder="votre@email.com"
              {...register("email")}
              hasError={!!errors.email}
            />
          </div>
        }
        infoCard={
          texts.banner ? <VariantBanner config={texts.banner} /> : undefined
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
