"use client";

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { useApiError } from "@/hooks/use-api-error";
import {
  bankDetailsSchema,
  type BankDetailsFormValues,
} from "@/lib/validations/situation";
import { postCreateBeneficiariesV3, postUpdateUserV3 } from "@/lib/bank-details-api";
import type {
  PrimaryBeneficiary,
  SecondaryBeneficiary,
  VitaBeneficiary,
} from "@/types/subscription";

export function BankDetailsStep() {
  const { next } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("bankDetails");
  const { error, showError, clearError } = useApiError();
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data: BankDetailsFormValues) => {
    clearError();

    const primary = session.beneficiaries[0] as PrimaryBeneficiary | undefined;

    const updatedBeneficiaries: VitaBeneficiary[] =
      session.beneficiaries.map((b, i) => {
        if (i === 0) return b;

        const secondary = b as SecondaryBeneficiary;

        return {
          ...secondary,
          phone: primary?.phone ?? secondary.phone ?? "",
          // Only include dates if they have valid values (not empty strings)
          ...(primary?.startDate && (primary.startDate as string) !== "" ? { startDate: primary.startDate } : {}),
          regimeType: primary?.regimeType ?? secondary.regimeType ?? "AS",
          previousMutualTermination:
            primary?.previousMutualTermination ??
            secondary.previousMutualTermination ??
            false,
          previousHealthMutualAddress:
            primary?.previousHealthMutualAddress ??
            secondary.previousHealthMutualAddress ??
            "",
          previousHealthMutualName:
            primary?.previousHealthMutualName ??
            secondary.previousHealthMutualName,
          // Only include contract dates if they have valid values
          ...(primary?.previousContractStartDate && (primary.previousContractStartDate as string) !== "" ? { previousContractStartDate: primary.previousContractStartDate } : {}),
          ...(primary?.previousContractEndDate && (primary.previousContractEndDate as string) !== "" ? { previousContractEndDate: primary.previousContractEndDate } : {}),
          ...(primary?.previousContractEndDateAsked && (primary.previousContractEndDateAsked as string) !== "" ? { previousContractEndDateAsked: primary.previousContractEndDateAsked } : {}),
          socialWelfareNumber:
            secondary.relationship === "CHILDREN"
              ? (primary?.socialWelfareNumber ?? "")
              : (secondary.socialWelfareNumber ?? ""),
        } satisfies SecondaryBeneficiary;
      });

    const user = session.user;
    const cleanIban = data.iban.replace(/\s/g, "");
    const bankDetails = {
      accountName: data.accountName,
      iban: cleanIban,
      bic: data.bic,
    };

    setLoading(true);

    try {
      const { beneficiaryIds } = await postCreateBeneficiariesV3(
        updatedBeneficiaries,
        user?.id ?? "",
      );

      const beneficiariesWithIds = updatedBeneficiaries.map((beneficiary, index) => ({
        ...beneficiary,
        beneficiaryId: beneficiaryIds[index] || (beneficiary as any).beneficiaryId,
      }));

      if (user) {
        await postUpdateUserV3(user, {
          iban: cleanIban,
          bic: data.bic,
          ibanHolderName: data.accountName,
        });
      }

      updateSession({
        bankDetails,
        beneficiaries: beneficiariesWithIds,
      });

      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue.";
      showError(message);
    } finally {
      setLoading(false);
    }
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
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={isValid && !loading}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
        selectionError={error}
      >
        <></>
      </StepScreen>
    </form>
  );
}
