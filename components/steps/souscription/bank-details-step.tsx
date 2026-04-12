"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
  bankDetailsSchema,
  type BankDetailsFormValues,
} from "@/lib/validations/situation";

export function BankDetailsStep() {
  const { next } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("bankDetails");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<BankDetailsFormValues>({
    resolver: standardSchemaResolver(bankDetailsSchema),
    defaultValues: {
      accountName: session.bankDetails?.accountName ?? "",
      iban: session.bankDetails?.iban ?? "",
      bic: session.bankDetails?.bic ?? "",
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: BankDetailsFormValues) => {
    updateSession({
      bankDetails: {
        accountName: data.accountName,
        iban: data.iban.replace(/\s/g, ""),
        bic: data.bic,
      },
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Le compte est au nom de</span>
            <PillInput
              placeholder="Nom du titulaire"
              {...register("accountName")}
              hasError={!!errors.accountName}
            />
            <span>, l&apos;IBAN est</span>
            <PillInput
              placeholder="FR76 1234 5678 9012 3456 789"
              {...register("iban")}
              hasError={!!errors.iban}
            />
            <span>et le BIC est</span>
            <PillInput
              placeholder="BNPAFRPP"
              {...register("bic")}
              hasError={!!errors.bic}
            />
          </div>
        }
        infoCard={
          texts.banner ? <AlertBanner {...texts.banner} /> : undefined
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
