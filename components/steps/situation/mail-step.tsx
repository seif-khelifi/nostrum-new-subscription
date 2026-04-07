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
import { mailSchema, type MailFormValues } from "@/lib/validations/situation";

export function MailStep() {
  const { next } = useStepper();
  const { session, updatePrimary } = useSituationForm();
  const texts = useStepTexts("mail");
  const p = session.beneficiaries[0];

  const {
    register, handleSubmit, formState: { errors, isValid, submitCount },
  } = useForm<MailFormValues>({
    resolver: standardSchemaResolver(mailSchema),
    defaultValues: { email: p?.email ?? "" },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: MailFormValues) => { updatePrimary({ email: data.email }); next(); };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title} hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>{"Je souhaite recevoir un devis personnalisé à l'adresse"}</span>
            <PillInput type="email" placeholder="votre@email.com" {...register("email")} hasError={!!errors.email} />
          </div>
        }
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={isValid} onNext={() => handleSubmit(onSubmit)()} isForm errors={errors}
      ><></></StepScreen>
    </form>
  );
}
