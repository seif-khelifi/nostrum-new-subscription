"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { PhoneInput } from "@/components/ui/phone-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { recapSchema, type RecapFormValues } from "@/lib/validations/situation";

export function RecapStep() {
  const { next } = useStepper();
  const { formData, updateFormData } = useSituationForm();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<RecapFormValues>({
    resolver: standardSchemaResolver(recapSchema),
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      email: formData.email || "",
      phone: formData.phone || "",
    },
    mode: "onTouched",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const onSubmit = (data: RecapFormValues) => {
    updateFormData({
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate.toISOString(),
      email: data.email,
      phone: data.phone,
    });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={<>Je crée mon compte</>}
        subtitle="Je recevrai un SMS pour confirmer mes infos."
        canProceed={isValid}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
      >
        {/* Continuous line form with inline editable fields */}
        <div className="flex flex-wrap items-center gap-2 font-semibold text-base sm:text-lg text-[#1D1B20]">
          <span>Mes informations sont exactes :</span>
          <br />
          <span>Je suis</span>
          <PillInput
            placeholder="Prénom"
            {...register("firstName")}
            hasError={!!errors.firstName}
            inputClassName="min-w-[100px] sm:min-w-[140px]"
          />
          <PillInput
            placeholder="Nom"
            {...register("lastName")}
            hasError={!!errors.lastName}
            inputClassName="min-w-[100px] sm:min-w-[140px]"
          />
          <span>, né(e) le</span>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <PillDatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="JJ/MM/AAAA"
                hasError={!!errors.birthDate}
                inputClassName="min-w-[120px] sm:min-w-[160px]"
              />
            )}
          />
          <span>Mon e-mail est</span>
          <PillInput
            type="email"
            placeholder="votre@email.com"
            {...register("email")}
            hasError={!!errors.email}
            inputClassName="min-w-[180px] sm:min-w-[240px]"
          />
          <span>et mon numéro de téléphone est</span>
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
        </div>
      </StepScreen>
    </form>
  );
}
