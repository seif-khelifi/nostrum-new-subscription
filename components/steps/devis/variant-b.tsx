"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import {
  OfferCard,
  CompareCard,
  OfferCardMoreFooter,
  OfferCardHoverGroup,
} from "@/components/ui/offer-card";
import type { OfferPlan } from "@/lib/plans";
import { PLAN_INDEX } from "@/lib/plans";
import { capitalize } from "@/lib/utils";
import { PlanLogo } from "@/components/ui/plan-logo";
import { getPricing, priceForPlan, fetchProductPricing } from "@/lib/pricing";
import type { VitaSessionStorage } from "@/types/subscription";
import { GeneralErrorDrawer } from "@/components/steps/devis/drawers";
import offersData from "@/data/offers.json";

/**
 * Devis Variant B — offer comparison layout.
 *
 * Desktop (lg+) : No sidebar. Black card for recommended offer,
 *                  #F6F4F0 card for other offers with hover "En savoir plus".
 * Mobile  (<lg) : Edge-to-edge #F3E5FA section with title + subtitle + recommended card,
 *                  "Nos autres formules" heading, stacked cards with #F3E5FA footer,
 *                  and a CompareCard at the bottom.
 */
export function DevisVariantB() {
  const { goToStepById, launchSubFlow } = useStepper();
  const { setValue: setSelectedOffer } = useSessionStorage<number | null>(
    "selectedOffer",
    null,
  );
  const { setValue: setMoreOffer, removeValue: clearMoreOffer } = useSessionStorage<number | null>(
    "moreOffer",
    null,
  );
  const { value: session, setValue: setSession } =
    useSessionStorage<VitaSessionStorage>("session", {
      beneficiaries: [],
      plans: null,
      selectedPlan: null,
    });

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);

  // Local pricing calculated from the beneficiaries in session (display only).
  const prices = getPricing(session.beneficiaries);

  /**
   * User chose an offer ("Je choisis la formule X").
   * 1. Save selected plan index to sessionStorage.
   * 2. Call the pricing API to get the product id + prorated price.
   * 3. Persist the full pricing result into the main session.
   * 4. Navigate to the garanties step only on success.
   */
  async function selectOffer(plan: string) {
    const planIndex = PLAN_INDEX[plan] ?? 0;
    setSelectedOffer(planIndex);
    clearMoreOffer(); // clear stale "en savoir plus" so garanties shows the chosen plan

    setLoadingPlan(plan);
    try {
      const patch = await fetchProductPricing(
        session.beneficiaries,
        planIndex,
        prices,
      );
      setSession({ ...session, ...patch });
      goToStepById("garanties");
    } catch (err) {
      console.error("[devis] pricing fetch failed", err);
      setErrorOpen(true);
    } finally {
      setLoadingPlan(null);
    }
  }

  /** Navigate to garanties to browse details — no API call, no session write. */
  function showGaranties(plan: string) {
    setMoreOffer(PLAN_INDEX[plan] ?? 0);
    goToStepById("garanties");
  }

  const recommended = offersData.offers.find((o) => o.tone === "recommended");
  const others = offersData.offers.filter((o) => o.tone !== "recommended");
  const compare = offersData.compareCard;

  return (
    <>
      {/* ─── Mobile layout (<lg) ─── */}
      <div className="flex flex-col lg:hidden">
        {/* Hero section: edge-to-edge #F3E5FA bg (negate parent p-4) */}
        <div className="-mx-4 -mt-4 bg-[#F3E5FA] px-4 pt-6 pb-8 sm:-mx-6 sm:-mt-6 sm:px-6">
          {/* Title — same size as other steps (text-4xl) */}
          <h1 className="text-4xl font-bold leading-tight text-[#290E67]">
            Votre formule mutuelle sur-mesure
          </h1>

          {/* Subtitle — matches StepScreen subtitle styling */}
          <div className="mt-2 flex items-center gap-2 text-base font-semibold text-[#1D1B20] sm:text-lg">
            <span>Pour vous et votre famille</span>
            <button
              type="button"
              onClick={() => goToStepById("proteger")}
              className="font-semibold text-[#9000E3] hover:underline"
            >
              Modifier
            </button>
          </div>

          {/* Recommended card */}
          {recommended && (
            <div className="mt-6">
              <OfferCard
                plan={recommended.plan as OfferPlan}
                tone="recommended"
                size="default"
                price={priceForPlan(prices, recommended.plan)}
                period={recommended.period}
                badgeTitle={recommended.badgeTitle ?? undefined}
                ctaLabel={`Je choisis la formule ${capitalize(recommended.plan)}`}
                descriptionTitle={recommended.descriptionTitle}
                description={recommended.description}
                moreLabel={`En savoir plus sur ma formule ${capitalize(recommended.plan)}`}
                onMoreClick={() => showGaranties(recommended.plan)}
                onCtaClick={() => selectOffer(recommended.plan)}
                loading={loadingPlan === recommended.plan}
                logo={<PlanLogo plan={recommended.plan} />}
              />
            </div>
          )}
        </div>

        {/* "Nos autres formules" heading — same size as step titles */}
        <div className="pt-8">
          <h1 className="text-4xl font-bold leading-tight text-[#490076]">
            Nos autres formules
          </h1>
        </div>

        {/* Default cards — #F3E5FA footer with "En savoir plus" */}
        <div className="flex flex-col gap-5 pt-6">
          {others.map((offer) => (
            <OfferCardMoreFooter
              key={offer.plan}
              moreLabel="En savoir plus"
              onMoreClick={() => showGaranties(offer.plan)}
            >
              <OfferCard
                plan={offer.plan as OfferPlan}
                tone="default"
                size="default"
                price={priceForPlan(prices, offer.plan)}
                period={offer.period}
                ctaLabel={`Je choisis la formule ${capitalize(offer.plan)}`}
                descriptionTitle={offer.descriptionTitle}
                description={offer.description}
                onCtaClick={() => selectOffer(offer.plan)}
                loading={loadingPlan === offer.plan}
                logo={<PlanLogo plan={offer.plan} />}
              />
            </OfferCardMoreFooter>
          ))}
        </div>

        {/* Compare card */}
        <div className="pt-8 pb-4">
          <CompareCard
            title={compare.title}
            description={compare.description}
            ctaLabel={compare.ctaLabel}
            onCtaClick={() => launchSubFlow(["offre_comparateur"], "devis_placeholder")}
          />
        </div>
      </div>

      {/* ─── Desktop layout (lg+) ─── */}
      <div className="hidden lg:block px-6">
        {/* 4-column grid — equal-width cards, stretch to match heights */}
        <div className="grid grid-cols-4 gap-6 items-stretch">
          {/* Recommended offer — black bg section spanning 1 col */}
          <div className="rounded-[24px] bg-black px-5 py-6 flex flex-col">
            <h1 className="text-4xl font-bold leading-tight text-white mb-6">
              Votre offre mutuelle sur-mesure
            </h1>

            {recommended && (
              <OfferCard
                plan={recommended.plan as OfferPlan}
                tone="recommended"
                size="sm"
                price={priceForPlan(prices, recommended.plan)}
                period={recommended.period}
                badgeTitle={recommended.badgeTitle ?? undefined}
                ctaLabel="Choisir cette offre"
                descriptionTitle={recommended.descriptionTitle}
                description={recommended.description}
                moreLabel="En savoir plus"
                onMoreClick={() => showGaranties(recommended.plan)}
                onCtaClick={() => selectOffer(recommended.plan)}
                loading={loadingPlan === recommended.plan}
                logo={<PlanLogo plan={recommended.plan} />}
              />
            )}
          </div>

          {/* Other offers — #F6F4F0 bg section spanning 3 cols */}
          <div className="col-span-3 rounded-[24px] bg-[#F6F4F0] ring-1 ring-[#E9E3DD] px-6 py-6 flex flex-col">
            {/* Header row: title + compare button */}
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-4xl font-bold leading-tight text-black">
                Nos autres offres
              </h1>
              <Button
                variant="ctaPurple"
                className="rounded-[24px] gap-2 px-6"
                onClick={() => {}}
              >
                <LayoutGrid className="h-4 w-4" />
                Comparer nos offres
              </Button>
            </div>

            {/* 3-column grid of other offers with hover "En savoir plus" */}
            <div className="grid grid-cols-3 gap-5 flex-1">
              {others.map((offer) => (
                <OfferCardHoverGroup
                  key={offer.plan}
                  moreLabel="En savoir plus"
                  onMoreClick={() => showGaranties(offer.plan)}
                >
                  <OfferCard
                    plan={offer.plan as OfferPlan}
                    tone="default"
                    size="default"
                    price={priceForPlan(prices, offer.plan)}
                    period={offer.period}
                    ctaLabel={`Je choisis la formule ${capitalize(offer.plan)}`}
                    descriptionTitle={offer.descriptionTitle}
                    description={offer.description}
                    onCtaClick={() => selectOffer(offer.plan)}
                    loading={loadingPlan === offer.plan}
                    logo={<PlanLogo plan={offer.plan} />}
                  />
                </OfferCardHoverGroup>
              ))}
            </div>
          </div>
        </div>
      </div>

      <GeneralErrorDrawer
        open={errorOpen}
        onOpenChange={setErrorOpen}
        title="Oops ! Une erreur s'est produite"
        message="Nous n'avons pas pu afficher nos tarifs pour le moment. Pas d'inquiétude, notre équipe est là pour vous aider ! Vous pouvez nous contacter directement au 01 62 45 01 05 (appel gratuit, du lundi au vendredi / 9h-19h) pour obtenir les informations dont vous avez besoin et souscrire en toute simplicité."
      />
    </>
  );
}
