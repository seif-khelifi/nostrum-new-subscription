"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { formatBirthdate, parseBirthdate, frenchOrdinal } from "@/lib/utils";
import {
  dateBirthChildrenSchema,
  type DateBirthChildrenFormValues,
} from "@/lib/validations/situation";
import { childMaxBirthdate } from "@/lib/utils";

export function DateBirthChildrenStep() {
  const { next } = useStepper();
  const { session, setBeneficiaries } = useSituationForm();
  const texts = useStepTexts("dateBirthChildren");

  /* ── Find all CHILDREN beneficiary indices ── */
  const childrenIndices = session.beneficiaries
    .map((b, i) => (b.relationship === "CHILDREN" ? i : -1))
    .filter((i) => i >= 0);

  /* ── Auto-advance if no children exist (safety net) ── */
  useEffect(() => {
    if (childrenIndices.length === 0) next();
  }, [childrenIndices.length, next]);

  /* ── Build default values from existing session data ── */
  const defaultChildren = childrenIndices.map((idx) => {
    const raw = session.beneficiaries[idx]?.birthdate ?? "";
    return { birthdate: raw ? parseBirthdate(raw) : undefined };
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<DateBirthChildrenFormValues>({
    resolver: standardSchemaResolver(dateBirthChildrenSchema),
    defaultValues: { children: defaultChildren },
    mode: "onTouched",
  });

  const { fields } = useFieldArray({ control, name: "children" });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: DateBirthChildrenFormValues) => {
    /* Bulk-update all beneficiaries at once to avoid stale-closure overwrites */
    const bens = [...session.beneficiaries];
    data.children.forEach((child, i) => {
      const sessionIdx = childrenIndices[i];
      if (sessionIdx !== undefined && bens[sessionIdx]) {
        bens[sessionIdx] = {
          ...bens[sessionIdx],
          birthdate: formatBirthdate(child.birthdate),
        };
      }
    });
    setBeneficiaries(bens);
    next();
  };

  if (childrenIndices.length === 0) return null;

  const isSingle = fields.length === 1;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            <span>Je veux protéger en premier</span>
            <PillInput
              readOnly
              value="Mon enfant"
              placeholder=""
              inputClassName="min-w-[100px] sm:min-w-[140px]"
            />
            {isSingle ? (
              <span>et il est né(e) le</span>
            ) : (
              <span>,</span>
            )}
            {fields.map((field, i) => {
              const fieldErrors = errors.children?.[i]?.birthdate;
              const isLast = i === fields.length - 1;

              return (
                <span key={field.id} className="contents">
                  {!isSingle && (
                    <span>
                      mon {frenchOrdinal(i + 1)} enfant est né(e) le
                    </span>
                  )}
                  <Controller
                    name={`children.${i}.birthdate`}
                    control={control}
                    render={({ field: f }) => (
                      <PillDatePicker
                        value={f.value}
                        onChange={f.onChange}
                        placeholder="JJ/MM/AAAA"
                        hasError={!!fieldErrors}
                        inputClassName="min-w-[120px] sm:min-w-[160px]"
                        fromDate={childMaxBirthdate()}
                        toDate={new Date()}
                      />
                    )}
                  />
                  {!isLast && i < fields.length - 2 && <span>,</span>}
                  {!isLast && i === fields.length - 2 && <span>et</span>}
                </span>
              );
            })}
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
        <></>
      </StepScreen>
    </form>
  );
}
