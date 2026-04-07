"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSanteForm } from "@/context/SanteFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { nousSommesSchema, type NousSommesFormValues } from "@/lib/validations/situation";
import type { SecondaryBeneficiary } from "@/types/subscription";

export function NousSommesStep() {
  const { next } = useStepper();
  const { session, setBeneficiaries } = useSituationForm();
  const { uiData, updateUI } = useSanteForm();
  const texts = useStepTexts("nousSommes");
  const protegerTexts = useStepTexts("proteger");

  const protegerLabel = uiData.proteger
    ? (protegerTexts.options?.find((o) => o.value === uiData.proteger)?.label ?? "")
    : "";

  const {
    register, handleSubmit, formState: { errors, isValid, submitCount },
  } = useForm<NousSommesFormValues>({
    resolver: standardSchemaResolver(nousSommesSchema),
    defaultValues: { familyCount: uiData.familyCount ?? (undefined as unknown as number) },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: NousSommesFormValues) => {
    updateUI({ familyCount: data.familyCount });

    const primary = session.beneficiaries[0];
    const existing = session.beneficiaries.slice(1);
    const count = data.familyCount - 1; // minus primary
    const result: SecondaryBeneficiary[] = [];

    if (uiData.proteger === "famille") {
      const married = existing.find((b) => b.relationship === "MARRIED") as SecondaryBeneficiary | undefined;
      result.push(married ?? { relationship: "MARRIED", birthdate: "" } as SecondaryBeneficiary);
      const children = existing.filter((b) => b.relationship === "CHILDREN");
      for (let i = 0; i < count - 1; i++) {
        result.push((children[i] as SecondaryBeneficiary) ?? { relationship: "CHILDREN", birthdate: "" } as SecondaryBeneficiary);
      }
    } else {
      const children = existing.filter((b) => b.relationship === "CHILDREN");
      for (let i = 0; i < count; i++) {
        result.push((children[i] as SecondaryBeneficiary) ?? { relationship: "CHILDREN", birthdate: "" } as SecondaryBeneficiary);
      }
    }

    setBeneficiaries(primary ? [primary, ...result] : [...result]);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title} hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je souhaite protéger</span>
            <PillInput readOnly value={protegerLabel} placeholder="" />
            <span>, nous sommes</span>
            <PillInput type="number" min={2} placeholder="2" {...register("familyCount", { valueAsNumber: true })} hasError={!!errors.familyCount} />
          </div>
        }
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={isValid} onNext={() => handleSubmit(onSubmit)()} isForm errors={errors}
      ><></></StepScreen>
    </form>
  );
}
