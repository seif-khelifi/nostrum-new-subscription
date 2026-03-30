"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowRight, RotateCcw } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { otpSchema, type OtpFormValues } from "@/lib/validations/situation";

export function EnvoiSmsStep() {
  const { next } = useStepper();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, submitCount },
  } = useForm<OtpFormValues>({
    resolver: standardSchemaResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const otpValue = watch("otp");
  const isComplete = otpValue.length === 6;

  const onSubmit = (data: OtpFormValues) => {
    // In a real scenario we'd verify the OTP server-side.
    sessionStorage.setItem("subscription_otp", data.otp);
    next();
  };

  const handleResend = () => {
    // TODO: trigger SMS resend API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={<>Je confirme mon compte</>}
        subtitle="J'entre le code reçu par SMS."
        canProceed={isValid}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
        customAction={
          isComplete ? (
            <Button type="submit" variant="ctaPurple" size="cta">
              Suivant
              <ArrowRight className="size-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ctaRenvoyer"
              size="cta"
              onClick={handleResend}
            >
              <RotateCcw className="size-4" />
              Renvoyer
            </Button>
          )
        }
      >
        {/* Phrase with inline OTP field */}
        <div className="flex flex-wrap items-center gap-2 font-semibold text-base sm:text-lg text-[#1D1B20]">
          <span>Mon code est le</span>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className={`
												size-10 sm:size-12 text-lg sm:text-xl font-semibold
												transition-colors duration-200
												${
                          field.value[i]
                            ? "border-[#490076] bg-[#490076] text-white"
                            : "border-[#E9E3DD] bg-[#F3E5FA] text-[#490076]"
                        }
												data-[active=true]:border-[#C86FFE] data-[active=true]:ring-2 data-[active=true]:ring-[#C86FFE]/40
											`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>
      </StepScreen>
    </form>
  );
}
