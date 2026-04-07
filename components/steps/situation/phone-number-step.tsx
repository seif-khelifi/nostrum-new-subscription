"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { phoneNumberSchema, type PhoneNumberFormValues } from "@/lib/validations/situation";

export function PhoneNumberStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const texts = useStepTexts("phoneNumber");
  const p = session.beneficiaries[0];

  const {
    control, handleSubmit, formState: { errors, isValid, submitCount },
  } = useForm<PhoneNumberFormValues>({
    resolver: standardSchemaResolver(phoneNumberSchema),
    defaultValues: { phone: p?.phone ?? "" },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: PhoneNumberFormValues) => { updatePrimary({ phone: data.phone }); next(); };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title} hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Vous pouvez aussi me joindre au</span>
            <Controller name="phone" control={control} render={({ field }) => (
              <PhoneInput {...field} placeholder="06 12 34 56 78" hasError={!!errors.phone} defaultCountry="FR" />
            )} />
            <span>pour obtenir des précieux conseils.</span>
          </div>
        }
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={isValid} onNext={() => handleSubmit(onSubmit)()} isForm errors={errors}
      ><></></StepScreen>
    </form>
  );
}
