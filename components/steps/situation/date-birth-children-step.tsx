"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { formatBirthdate, parseBirthdate } from "@/lib/utils";
import {
  dateBirthChildrenSchema,
  type DateBirthChildrenFormValues,
  ENFANT_MIN_AGE,
  ENFANT_MAX_AGE,
} from "@/lib/validations/situation";

/* ── French ordinal labels ── */

const ORDINALS: Record<number, string> = {
  1: "1er",
  2: "2ème",
  3: "3ème",
  4: "4ème",
};

export function DateBirthChildrenStep() {
  const { next } = useStepper();
  const { session, updateBeneficiary } = useSituationForm();
  const texts = useStepTexts("dateBirthChildren");

  /* ── Find all CHILDREN beneficiaries ── */
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

  useFormErrorToast(
    errors,
    errorKey(errors),
    submitCount,
  );

  const onSubmit = (data: DateBirthChildrenFormValues) => {
    data.children.forEach((child, i) => {
      const sessionIdx = childrenIndices[i];
      if (sessionIdx !== undefined) {
        updateBeneficiary(sessionIdx, {
          birthdate: formatBirthdate(child.birthdate),
        });
      }
    });
    next();
  };

  if (childrenIndices.length === 0) return null;

  const now = new Date();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            {fields.map((field, i) => {
              const ordinal = ORDINALS[i + 1] ?? `${i + 1}ème`;
              const isLast = i === fields.length - 1;
              const fieldErrors = errors.children?.[i]?.birthdate;

              return (
                <span key={field.id} className="contents">
                  {fields.length === 1 ? (
                    <span>Mon enfant est né(e) le</span>
                  ) : (
                    <span>
                      {i === 0 ? "Mon" : "mon"} {ordinal} enfant est né(e) le
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
                        fromYear={now.getFullYear() - ENFANT_MAX_AGE}
                        toYear={now.getFullYear() - ENFANT_MIN_AGE}
                      />
                    )}
                  />
                  {!isLast && fields.length > 2 && <span>,</span>}
                  {!isLast && fields.length === 2 && <span>et</span>}
                  {!isLast && fields.length > 2 && i === fields.length - 2 && (
                    <span>et</span>
                  )}
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
