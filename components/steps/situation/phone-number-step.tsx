"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { InfoIcon } from "lucide-react";
import { PillInput } from "@/components/ui/pill-input";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  phoneNumberSchema,
  type PhoneNumberFormValues,
} from "@/lib/validations/situation";

/**
 * Normalises a French phone number to international +33 format.
 * e.g. "06 12 34 56 78" → "+33612345678"
 */
function normaliseFrenchPhone(raw: string): string {
  const digits = raw.replace(/[\s.\-()]/g, "");
  if (digits.startsWith("0")) {
    return "+33" + digits.slice(1);
  }
  if (digits.startsWith("0033")) {
    return "+33" + digits.slice(4);
  }
  if (digits.startsWith("+33")) {
    return digits;
  }
  return "+33" + digits;
}

export function PhoneNumberStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<PhoneNumberFormValues>({
    resolver: standardSchemaResolver(phoneNumberSchema),
    defaultValues: {
      phone: formData.phone,
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: PhoneNumberFormValues) => {
    const normalised = normaliseFrenchPhone(data.phone);
    updateFormData({ phone: normalised });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={<>Et pour vous contacter ?</>}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Vous pouvez aussi me joindre au</span>
            <PillInput
              type="tel"
              placeholder="06 12 34 56 78"
              {...register("phone")}
              hasError={!!errors.phone}
              inputClassName="min-w-[150px] sm:min-w-[200px]"
            />
            <span>pour obtenir des précieux conseils.</span>
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
      >
        {/* No additional children — form is in subtitle */}
        <></>
      </StepScreen>
    </form>
  );
}
