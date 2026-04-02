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
  socialSecuritySchema,
  type SocialSecurityFormValues,
} from "@/lib/validations/situation";

export function SocialSecurityStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("socialSecurity");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<SocialSecurityFormValues>({
    resolver: standardSchemaResolver(socialSecuritySchema),
    defaultValues: {
      socialSecurityNumber: formData.socialSecurityNumber,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: SocialSecurityFormValues) => {
    updateFormData({
      socialSecurityNumber: data.socialSecurityNumber,
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Mon numéro de sécurité sociale est</span>
            <PillInput
              placeholder="1 23 45 678 901 234 56"
              {...register("socialSecurityNumber")}
              hasError={!!errors.socialSecurityNumber}
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
