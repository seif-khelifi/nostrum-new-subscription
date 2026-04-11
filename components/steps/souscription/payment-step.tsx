"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
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
import {
  extractStripeCustomerId,
  postCreateStripeCustomer,
  postSetupIntent,
} from "@/lib/payment-api";
import { getStripePromise } from "@/lib/stripe-client";

const elementsOptions = {
  mode: "setup" as const,
  currency: "eur",
  locale: "fr" as const,
  paymentMethodTypes: ["card", "sepa_debit"],
  setupFutureUsage: "off_session" as const,
};

const paymentElementOptions = {
  layout: "tabs" as const,
  paymentMethodOrder: ["card", "sepa_debit"],
  wallets: { applePay: "never" as const, googlePay: "never" as const },
  fields: {
    billingDetails: {
      address: {
        line1: "never" as const,
        line2: "never" as const,
        city: "never" as const,
        state: "never" as const,
        postalCode: "never" as const,
        country: "never" as const,
      },
    },
  },
};

const expressCheckoutOptions = {
  buttonType: {
    applePay: "plain" as const,
    googlePay: "plain" as const,
  },
};

function PaymentForm() {
  const { next } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("payment");
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 1. Validate form fields
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Vérifiez vos informations bancaires.");
        toast.error(
          submitError.message ?? "Vérifiez vos informations bancaires.",
        );
        return;
      }

      // 2. Resolve Stripe customer ID
      const user = session.user;
      if (!user?.id)
        throw new Error(
          "Votre session est incomplète. Reprenez la souscription depuis le début.",
        );

      const customerId = extractStripeCustomerId(
        (await postCreateStripeCustomer(session)).data,
      );

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
        setError(confirmError.message ?? "Le paiement a échoué.");
        toast.error(confirmError.message ?? "Le paiement a échoué.");
        return;
      }

      if (setupIntent) {
        const pmId =
          typeof setupIntent.payment_method === "string"
            ? setupIntent.payment_method
            : setupIntent.payment_method?.id;

        const pmType = setupIntent.payment_method_types?.[0];

        updateSession({
          paymentMethodId: pmId,
          ...(pmType === "card" || pmType === "sepa_debit"
            ? { paymentMethodType: pmType }
            : {}),
          user: {
            ...user,
            psp_customer_id: customerId,
            psp_payment_method_id: pmId ?? null,
          },
        });

        next();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressCheckoutConfirm = async (
    event: StripeExpressCheckoutElementConfirmEvent,
  ) => {
    if (!stripe || !elements) return;

    setError(null);
    setLoading(true);
    try {
      // 1. Resolve Stripe customer ID
      const user = session.user;
      if (!user?.id)
        throw new Error(
          "Votre session est incomplète. Reprenez la souscription depuis le début.",
        );

      const customerId =
        user.psp_customer_id?.trim() ||
        extractStripeCustomerId((await postCreateStripeCustomer(session)).data);

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
        event.paymentFailed({
          message: confirmError.message ?? "Le paiement a échoué.",
        });
        setError(confirmError.message ?? "Le paiement a échoué.");
        toast.error(confirmError.message ?? "Le paiement a échoué.");
        return;
      }

      if (setupIntent) {
        const pmId =
          typeof setupIntent.payment_method === "string"
            ? setupIntent.payment_method
            : setupIntent.payment_method?.id;

        const pmType = setupIntent.payment_method_types?.[0];

        updateSession({
          paymentMethodId: pmId,
          ...(pmType === "card" || pmType === "sepa_debit"
            ? { paymentMethodType: pmType }
            : {}),
          user: {
            ...user,
            psp_customer_id: customerId,
            psp_payment_method_id: pmId ?? null,
          },
        });

        next();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      event.paymentFailed({ message });
      setError(message);
      toast.error(message);
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
          <Button
            type="submit"
            variant="ctaPurple"
            size="cta"
            loading={loading}
          >
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
          <div className="w-full rounded-xl border border-[#E9E6DF] bg-white p-3 sm:p-4">
            <PaymentElement options={paymentElementOptions} />
          </div>
        </div>
      </StepScreen>
    </form>
  );
}

export function PaymentStep() {
  const stripeP = getStripePromise();

  if (!stripeP) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 py-8 px-2 sm:pl-12">
        <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-[#1D1B20]">
          Paiement indisponible
        </h1>
        <p className="text-[#444444]">
          La clé publique Stripe est manquante
          (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripeP} options={elementsOptions}>
      <PaymentForm />
    </Elements>
  );
}
