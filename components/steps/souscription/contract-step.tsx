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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Keep `next` in a ref so the message listener effect never re-binds.
  // A re-binding listener during a postMessage storm is part of what froze the tab.
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

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

  /* ── 2. Listen for OneSpan ESL (Event Notifier) postMessage events ──
   *
   * Per OneSpan's spec (https://www.onespan.com/blog/setting-onespan-signs-event-notifier):
   *   - OneSpan's iframe fires `ESL:MESSAGE:REGISTER` on load; the parent
   *     must reply with `ESL:MESSAGE:ACTIVATE_EVENTS` or no further events
   *     will be emitted.
   *   - For every other ESL event, the parent is expected to echo the
   *     event back to `event.source`. Some events PAUSE the signing
   *     ceremony until that echo is received; without it, signing hangs.
   *
   * The previous implementation correctly echoed ESL events but did so for
   * every `window` message, including those from Stripe iframes, browser
   * extensions, and Next.js HMR — creating a postMessage feedback loop
   * that saturated the main thread and froze the tab.
   *
   * The fix: apply the OneSpan sample logic ONLY to messages that (a) come
   * from our OneSpan iframe's contentWindow and (b) are strings prefixed
   * with `ESL:MESSAGE:`. Everything else is ignored. This keeps the
   * protocol intact while preventing cross-iframe ping-pong.
   */
  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const iframeWindow = iframeRef.current?.contentWindow;
      // Ignore any message that didn't originate from our OneSpan iframe.
      if (!iframeWindow || event.source !== iframeWindow) return;

      const data = event.data;
      // Only process the OneSpan ESL protocol; drop anything else that
      // happens to come from the same window (analytics, etc.).
      if (typeof data !== "string" || !data.startsWith("ESL:MESSAGE:")) return;

      const origin = event.origin;
      const source = event.source as WindowProxy;

      switch (data) {
        case "ESL:MESSAGE:REGISTER":
          // Handshake — tell OneSpan we're listening for events.
          source.postMessage("ESL:MESSAGE:ACTIVATE_EVENTS", origin);
          return;

        case "ESL:MESSAGE:SUCCESS:DOCUMENT_CONFIRM":
        case "ESL:MESSAGE:SUCCESS:SIGNER_COMPLETE":
        case "ESL:MESSAGE:SUCCESS:SIGNER_COMPLETE_REVIEWED":
          if (hasAdvanced.current) return;
          hasAdvanced.current = true;
          // Echo the event so OneSpan knows we acknowledged it, then
          // advance the stepper.
          source.postMessage(data, origin);
          setContractSigned(true);
          nextRef.current();
          return;

        default:
          // Protocol requirement: echo any other ESL event back so
          // OneSpan resumes its normal flow. Safe here because we've
          // already verified source + prefix above, so no feedback loop.
          source.postMessage(data, origin);
          return;
      }
    }

    window.addEventListener("message", receiveMessage, false);
    return () => window.removeEventListener("message", receiveMessage, false);
    // Empty deps on purpose — the listener uses refs for all mutable values,
    // so it attaches exactly once for the component's lifetime.
  }, []);

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
            ref={iframeRef}
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
