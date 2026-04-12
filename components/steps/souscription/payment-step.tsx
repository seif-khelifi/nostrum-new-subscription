"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useApiError } from "@/hooks/use-api-error";
import { postCreateStripeCustomer, postSetupIntent } from "@/lib/payment-api";
import { getStripePromise } from "@/lib/stripe-client";
import {
  elementsOptions,
  paymentElementOptions,
  expressCheckoutOptions,
} from "@/config/stripe";

/**
 * Inner form — must be rendered inside <Elements> so useStripe/useElements work.
 * This is a Stripe SDK constraint, not a design choice.
 */
function PaymentForm() {
  const { next } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("payment");
  const stripe = useStripe();
  const elements = useElements();

  const { error, showError, clearError } = useApiError();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 1. Validate form fields
      const { error: submitError } = await elements.submit();
      if (submitError) {
        showError(submitError.message ?? "Vérifiez vos informations bancaires.");
        return;
      }

      // 2. Resolve Stripe customer ID
      const user = session.user;
      if (!user?.id) {
        showError("Votre session est incomplète. Reprenez la souscription depuis le début.");
        return;
      }

      const customerId = await postCreateStripeCustomer(session);

      // 3. Create SetupIntent on the backend
      const clientSecret = await postSetupIntent(customerId, user.id);

      // 4. Confirm the SetupIntent with collected payment details
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              address: {
                country: user.address_country || "FR",
                line1: user.address_street_name || "",
                line2: user.address_additionnal || "",
                city: user.address_city || "",
                postal_code: user.address_zip || "",
                state: "",
              },
            },
          },
        },
      });

      if (confirmError) {
        showError(confirmError.message ?? "Le paiement a échoué.");
        return;
      }

      // 5. Persist to session and advance
      if (setupIntent) {
        const pmId = setupIntent.payment_method as string;
        const pmType = setupIntent.payment_method_types?.[0];

        updateSession({
          paymentMethodId: pmId,
          ...(pmType === "card" || pmType === "sepa_debit" ? { paymentMethodType: pmType } : {}),
          user: { ...user, psp_customer_id: customerId, psp_payment_method_id: pmId },
        });
        next();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleExpressCheckoutConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) return;

    clearError();
    setLoading(true);
    try {
      // 1. Resolve Stripe customer ID
      const user = session.user;
      if (!user?.id) {
        showError("Votre session est incomplète. Reprenez la souscription depuis le début.");
        return;
      }

      const customerId = await postCreateStripeCustomer(session);

      // 2. Create SetupIntent on the backend
      const clientSecret = await postSetupIntent(customerId, user.id);

      // 3. Build billing address from express event, fall back to session
      const a = event.billingDetails?.address;
      const address = a?.line1
        ? {
            line1: a.line1,
            line2: a.line2 ?? "",
            city: a.city ?? "",
            postal_code: a.postal_code ?? "",
            country: a.country ?? user.address_country ?? "FR",
            state: a.state ?? "",
          }
        : {
            country: user.address_country || "FR",
            line1: user.address_street_name || "",
            line2: user.address_additionnal || "",
            city: user.address_city || "",
            postal_code: user.address_zip || "",
            state: "",
          };

      // 4. Confirm the SetupIntent
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: { billing_details: { address } },
        },
      });

      if (confirmError) {
        event.paymentFailed({ message: confirmError.message ?? "Le paiement a échoué." });
        showError(confirmError.message ?? "Le paiement a échoué.");
        return;
      }

      // 5. Persist to session and advance
      if (setupIntent) {
        const pmId = setupIntent.payment_method as string;
        const pmType = setupIntent.payment_method_types?.[0];

        updateSession({
          paymentMethodId: pmId,
          ...(pmType === "card" || pmType === "sepa_debit" ? { paymentMethodType: pmType } : {}),
          user: { ...user, psp_customer_id: customerId, psp_payment_method_id: pmId },
        });
        next();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue.";
      event.paymentFailed({ message });
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepScreen
        title={texts.title}
        hideTitle={!!texts.navbarTitle}
        subtitle={texts.subtitle}
        canProceed
        onNext={() => {}}
        isForm
        selectionError={error}
        customAction={
          <Button type="submit" variant="ctaPurple" size="cta" loading={loading}>
            {texts.ctaLabel ?? "Continuer"}
            <ArrowRight className="size-5" />
          </Button>
        }
      >
        <div className="flex w-full max-w-xl flex-col gap-4">
          <div className="min-h-[40px] w-full">
            <ExpressCheckoutElement
              options={expressCheckoutOptions}
              onConfirm={handleExpressCheckoutConfirm}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E9E3DD]" />
            <span className="text-sm font-medium text-[#8E7A9E]">ou</span>
            <div className="h-px flex-1 bg-[#E9E3DD]" />
          </div>

          <div className="w-full">
            <PaymentElement options={paymentElementOptions} />
          </div>
        </div>
      </StepScreen>
    </form>
  );
}

/** Wraps PaymentForm in Stripe's Elements provider — useStripe()/useElements() require this. */
export function PaymentStep() {
  return (
    <Elements stripe={getStripePromise()!} options={elementsOptions}>
      <PaymentForm />
    </Elements>
  );
}
