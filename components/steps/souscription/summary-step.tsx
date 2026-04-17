"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { StepScreen } from "@/components/steps/step-screen";
import { SummarySuccessStep } from "@/components/steps/souscription/summary-success-step";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useApiError } from "@/hooks/use-api-error";
import {
  postCreateSubscriptionV3,
  postGetContractV3,
  type ContractStatus,
} from "@/lib/contract-api";
import { getStripePromise } from "@/lib/stripe-client";
import { elementsOptions } from "@/config/stripe";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60;

/* ------------------------------------------------------------------ */
/*  Inner — must be inside <Elements> to use useStripe                 */
/* ------------------------------------------------------------------ */

function SummaryInner() {
  const { session } = useSituationForm();
  const texts = useStepTexts("summary");
  const stripe = useStripe();

  const { error, showError, clearError } = useApiError();
  const [done, setDone] = useState(false);
  const hasStarted = useRef(false);

  /**
   * Poll the contract status until it leaves DRAFT / CREATION_IN_PROGRESS / PENDING.
   * Returns the final status (or throws for unrecoverable errors).
   */
  async function pollContractStatus(id: string): Promise<ContractStatus> {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      const { contract } = await postGetContractV3(id);
      const status = contract.status;

      if (status === "PENDING" || status === "CREATION_IN_PROGRESS") {
        // Keep waiting
        continue;
      }
      if (status === "DRAFT") {
        // Still being drafted — keep polling
        continue;
      }
      return status;
    }
    throw new Error(
      "La préparation du contrat prend plus de temps que prévu. Veuillez réessayer plus tard.",
    );
  }

  useEffect(() => {
    if (hasStarted.current) return;
    if (!stripe) return;
    hasStarted.current = true;

    (async () => {
      clearError();

      const contractId = session.contract?.id;
      if (!contractId) {
        showError("Contrat introuvable. Reprenez la souscription depuis le début.");
        return;
      }

      if (
        !session.plans ||
        session.selectedPlan === null ||
        session.selectedPlan === undefined ||
        !Object.values(session.plans)[session.selectedPlan]
      ) {
        showError("Formule sélectionnée invalide. Reprenez la souscription depuis le début.");
        return;
      }

      const user = session.user;
      const paymentMethodId = session.paymentMethodId;
      const customerId = user?.psp_customer_id;
      if (!user?.id || !paymentMethodId || !customerId) {
        showError("Votre session est incomplète. Reprenez la souscription depuis le début.");
        return;
      }

      try {
        // 1. Wait for the contract to reach a signable/ready status
        const finalStatus = await pollContractStatus(contractId);

        if (finalStatus === "STANDBY") {
          showError(
            "Votre contrat est en attente de validation. Nous reviendrons vers vous prochainement.",
          );
          return;
        }

        // 2. Create the Stripe subscription
        const { clientSecret } = await postCreateSubscriptionV3({
          contractId,
          userId: user.id,
          pspPaymentMethodId: paymentMethodId,
          customerId,
          selectedPlanIndex: session.selectedPlan,
          unitAmount: parseFloat(
            Object.values(session.plans)[session.selectedPlan]!,
          ),
          prorated_price: session.prorated_price ?? 0,
          coupon: session.coupon?.code ?? "",
        });

        // 3. If Stripe requires an additional confirmation, do it
        if (clientSecret) {
          const result = await stripe.confirmCardPayment(clientSecret);
          if (result.error) {
            showError(result.error.message ?? "Le paiement a échoué.");
            return;
          }
        }

        setDone(true);
      } catch (err) {
        showError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la finalisation de la souscription.",
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

  if (done) {
    return <SummarySuccessStep />;
  }

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
      subtitle={texts.subtitle}
      canProceed={false}
      onNext={() => {}}
      selectionError={error}
      customAction={<></>}
    >
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        {!error && <Loader2 className="size-8 animate-spin text-[#8E7A9E]" />}
      </div>
    </StepScreen>
  );
}

/**
 * Summary step — finalises the subscription after contract signature.
 *
 * Wrapped in Stripe's <Elements> provider because `stripe.confirmCardPayment`
 * requires it, matching the pattern used by `PaymentStep`.
 */
export function SummaryStep() {
  return (
    <Elements stripe={getStripePromise()!} options={elementsOptions}>
      <SummaryInner />
    </Elements>
  );
}
