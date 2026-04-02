"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { StepScreen } from "@/components/steps/step-screen";
import { VariantBanner } from "@/components/steps/variant-banner";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  phoneNumberSchema,
  type PhoneNumberFormValues,
} from "@/lib/validations/situation";

export function PhoneNumberStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();
  const texts = useStepTexts("phoneNumber");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<PhoneNumberFormValues>({
    resolver: standardSchemaResolver(phoneNumberSchema),
    defaultValues: {
      phone: formData.phone || "",
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: PhoneNumberFormValues) => {
    updateFormData({ phone: data.phone });
    next();
  };

  // Banner: use variant config, fall back to nothing if explicitly null
  const bannerNode =
    texts?.banner === null ? undefined : texts?.banner ? (
      <VariantBanner config={texts.banner} />
    ) : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts?.title ?? <>Et pour vous contacter ?</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Vous pouvez aussi me joindre au</span>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="06 12 34 56 78"
                  hasError={!!errors.phone}
                  defaultCountry="FR"
                />
              )}
            />
            <span>pour obtenir des précieux conseils.</span>
          </div>
        }
        infoCard={bannerNode}
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
