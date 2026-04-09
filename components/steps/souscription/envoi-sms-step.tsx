"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowRight, RotateCcw } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { AlertBanner } from "@/components/ui/alert";
import { useStepper } from "@/context/StepperContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { otpSchema, type OtpFormValues } from "@/lib/validations/situation";
import { requestOtp, verifyPhone } from "@/lib/sign-in";
import { GeneralErrorDrawer } from "@/components/steps/devis/drawers/general-error-drawer";

export function EnvoiSmsStep() {
  const { next } = useStepper();
  const texts = useStepTexts("envoiSms");
  const { session, updateSession } = useSituationForm();

  const [apiError, setApiError] = useState<string | null>(null);
  const [contractDrawerOpen, setContractDrawerOpen] = useState(false);
  const [contractDrawerMessage, setContractDrawerMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, submitCount },
  } = useForm<OtpFormValues>({
    resolver: standardSchemaResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onChange",
  });

  useFormErrorToast(errors, errorKey(errors), submitCount);

  const phone = session.beneficiaries[0]?.phone;
  const otpValue = watch("otp");
  const isComplete = otpValue.length === 6;

  const hasSent = useRef(false);

  async function sendOtp() {
    if (!phone) return;
    setApiError(null);
    try {
      await requestOtp(phone);
    } catch (err) {
      const message = (err as Error).message;
      setApiError(message);
      toast.error(message);
    }
  }

  /* Send OTP once when phone becomes available */
  useEffect(() => {
    if (!phone || hasSent.current) return;
    hasSent.current = true;
    sendOtp();
  }, [phone]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: OtpFormValues) {
    if (!phone) return;
    setApiError(null);
    setSubmitting(true);
    try {
      const { user, hasTinderContract, hasVitaContract } = await verifyPhone(
        phone,
        data.otp,
      );

      if (hasVitaContract || hasTinderContract) {
        const contractType = hasVitaContract ? "Vita" : "Tinder";
        setContractDrawerMessage(
          `Il semblerait que vous ayez déjà un contrat ${contractType} signé, rendez-vous sur votre application ou contactez notre service client.`,
        );
        setContractDrawerOpen(true);
        return;
      }
      updateSession({ user: user! });
      next();
    } catch (err) {
      const message = (err as Error).message;
      setApiError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={texts.subtitle}
        infoCard={texts.banner ? <AlertBanner {...texts.banner} /> : undefined}
        canProceed={isValid}
        onNext={() => handleSubmit(onSubmit)()}
        isForm
        errors={errors}
        selectionError={apiError}
        customAction={
          isComplete ? (
            <Button type="submit" variant="ctaPurple" size="cta" loading={submitting}>
              {texts.ctaLabel}
              <ArrowRight className="size-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ctaRenvoyer"
              size="cta"
              onClick={sendOtp}
            >
              <RotateCcw className="size-4" />
              Renvoyer
            </Button>
          )
        }
      >
        {/* Phrase with inline OTP field */}
        <div className="flex flex-wrap items-center gap-2 font-semibold text-base sm:text-lg text-[#1D1B20]">
          <span>Mon code est </span>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setApiError(null);
                }}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} variant="otp" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>
      </StepScreen>

      <GeneralErrorDrawer
        open={contractDrawerOpen}
        onOpenChange={setContractDrawerOpen}
        title="Contrat existant"
        message={contractDrawerMessage}
        showCallButton={false}
      />
    </form>
  );
}
