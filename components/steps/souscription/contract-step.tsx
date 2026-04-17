"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useStepTexts } from "@/context/VariantContext";
import { useApiError } from "@/hooks/use-api-error";
import { postCreateContractV3 } from "@/lib/contract-api";

/**
 * OneSpan contract step.
 *
 * Flow:
 *  1. On mount, call createContractV3 to obtain a OneSpan signing URL.
 *  2. Render the URL in an iframe so the user can read & sign.
 *  3. Listen for OneSpan ESL postMessage events — on signature success,
 *     advance the stepper to the summary step.
 */
export function ContractStep() {
  const { next } = useStepper();
  const { session, updateSession, isReady } = useSituationForm();
  const texts = useStepTexts("contract");

  const { error, showError, clearError } = useApiError();
  const [contractUrl, setContractUrl] = useState<string | null>(null);
  const [contractSigned, setContractSigned] = useState(false);
  const hasFetched = useRef(false);
  const hasAdvanced = useRef(false);

  /* ── 1. Create contract once session is ready ── */
  useEffect(() => {
    if (!isReady || hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      clearError();
      try {
        const { id, rk_OneSpanContractURL } = await postCreateContractV3(
          session,
          session.coupon,
        );
        updateSession({ contract: { id, rk_OneSpanContractURL } });
        setContractUrl(rk_OneSpanContractURL);
      } catch (err) {
        showError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la création du contrat.",
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  /* ── 2. Listen for OneSpan ESL postMessage events ── */
  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const origin = event.origin;
      const data = event.data;
      const source = event.source as WindowProxy | null;

      switch (data) {
        case "ESL:MESSAGE:REGISTER":
          source?.postMessage("ESL:MESSAGE:ACTIVATE_EVENTS", origin);
          return;

        case "ESL:MESSAGE:SUCCESS:DOCUMENT_CONFIRM":
        case "ESL:MESSAGE:SUCCESS:SIGNER_COMPLETE":
        case "ESL:MESSAGE:SUCCESS:SIGNER_COMPLETE_REVIEWED":
          if (hasAdvanced.current) return;
          hasAdvanced.current = true;
          source?.postMessage(data, origin);
          setContractSigned(true);
          next();
          return;

        default:
          if (source) source.postMessage(data, origin);
          return;
      }
    }

    window.addEventListener("message", receiveMessage, false);
    return () => window.removeEventListener("message", receiveMessage, false);
  }, [next]);

  return (
    <StepScreen
      title={texts.title}
      hideTitle={!!texts.navbarTitle}
      subtitle={texts.subtitle}
      canProceed={contractSigned}
      onNext={next}
      selectionError={error}
      customAction={<></>}
    >
      <div className="w-full">
        {!contractUrl && !error && (
          <div className="flex min-h-[40vh] w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[#8E7A9E]" />
          </div>
        )}

        {contractUrl && !contractSigned && (
          <iframe
            className="h-[80vh] w-full rounded-xl border border-[#E9E3DD]"
            src={contractUrl}
            title="Contrat OneSpan"
            data-testid="contractIframe"
          />
        )}

        {contractSigned && (
          <div className="flex min-h-[40vh] w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[#8E7A9E]" />
          </div>
        )}
      </div>
    </StepScreen>
  );
}
