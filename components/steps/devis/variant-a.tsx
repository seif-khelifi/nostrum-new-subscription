"use client";

import { useState } from "react";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import {
  OfferCard,
  CompareCard,
  OfferCardMoreFooter,
  OfferCardHoverGroup,
} from "@/components/ui/offer-card";
import { OfferGarantiesCard } from "@/components/ui/offer-garanties-card";
import { OfferAdvantagesAccordion } from "@/components/ui/offer-advantages-accordion";
import type { AdvantageLineItem } from "@/components/ui/offer-advantages-accordion";
import { AlertBanner } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import type { OfferPlan } from "@/lib/plans";
import { PLAN_INDEX } from "@/lib/plans";
import { capitalize } from "@/lib/utils";
import { PlanLogo } from "@/components/ui/plan-logo";
import { getPricing, priceForPlan, fetchProductPricing } from "@/lib/pricing";
import type { VitaSessionStorage } from "@/types/subscription";
import { PricingErrorDrawer } from "@/components/steps/devis/drawers";
import offersData from "@/data/offers.json";

/**
 * Devis Variant A — offer comparison layout.
 *
 * Desktop (lg+) : Centred devis tabs (#CE99FF bg, white selected pill).
 *                  Tab 1 "Mon offre recommandée": #F3E5FA card, 2-col (40/60) —
 *                  left = recommended OfferCard + AlertBanner,
 *                  right = OfferGarantiesCard (hero SVG, title, subtitle, buttons).
 *                  Tab 2 "Nos autres offres": #F3E5FA card with 3-col grid of
 *                  OfferCardHoverGroup cards + compare button.
 * Mobile  (<lg) : Edge-to-edge #F3E5FA section with title + subtitle + recommended card,
 *                  "Nos autres formules" heading, stacked cards with #F3E5FA footer,
 *                  and a CompareCard at the bottom.
 */
export function DevisVariantA() {
  const { goToStepById } = useStepper();
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
            onCtaClick={() => goToStepById("offre_comparateur")}
          />
        </div>
      </div>

      {/* ─── Desktop layout (lg+) ─── */}
      <div className="hidden lg:flex flex-col items-center w-full py-10 px-6 lg:px-12">
        <Tabs defaultValue="recommended" className="w-full">
          {/* Tabs pill — centred, constrained width */}
          <div className="flex justify-center">
            <TabsList variant="devis" className="max-w-md">
              <TabsTrigger value="recommended" variant="devis">
                Mon offre recommandée
              </TabsTrigger>
              <TabsTrigger value="others" variant="devis">
                Nos autres offres
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Tab 1: Recommended offer ── */}
          <TabsContent value="recommended">
            <div className="mt-6 rounded-[24px] bg-[#F3E5FA] p-8">
              <div className="grid grid-cols-5 gap-8 items-stretch">
                {/* Left column — 40% (2 of 5 cols) */}
                <div className="col-span-2 flex flex-col gap-6">
                  {/* Recommended OfferCard */}
                  {recommended && (
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
                  )}

                  {/* AlertBanner — girl illustration */}
                  <AlertBanner
                    variant="info"
                    title="Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone."
                    subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
                    imageSrc="/alertBanner/girl.svg"
                    imageAlt="Girl"
                  />
                </div>

                {/* Right column — 60% (3 of 5 cols) */}
                <div className="col-span-3 flex flex-col">
                  <OfferGarantiesCard
                    className="h-full"
                    imageSrc="/offerLogos/avantages-variant-a.svg"
                    imageAlt="Avantages de votre formule"
                    title={
                      <>
                        Et concrètement,
                        <br />
                        les avantages pour vous ?
                      </>
                    }
                    subtitle={`Découvrez pourquoi ${capitalize(recommended?.plan ?? "silver")} est faite pour vous, en prenant soin de ce que les autres oublient.`}
                    primaryLabel="Voir le tableau de garanties"
                    onPrimaryClick={() =>
                      showGaranties(recommended?.plan ?? "silver")
                    }
                    secondaryLabel="En savoir plus"
                    onSecondaryClick={() =>
                      showGaranties(recommended?.plan ?? "silver")
                    }
                  />
                </div>
              </div>
            </div>
            {/* Compare card — inline layout, below tabs, always visible */}
            <div className="mt-8 w-full">
              <CompareCard
                layout="inline"
                title={compare.title}
                description={compare.description}
                ctaLabel={compare.ctaLabel}
                onCtaClick={() => goToStepById("offre_comparateur")}
              />
            </div>
          </TabsContent>

          {/* ── Tab 2: Other offers ── */}
          <TabsContent value="others">
            <div className="mt-6">
              {/* Title — centred, bricolage-grotesque (same font as h1), bigger */}
              <h1 className="text-center font-[family-name:var(--font-bricolage-grotesque)] text-5xl font-bold leading-tight text-[#290E67]/20">
                Nos autres offres
              </h1>

              {/* Cards + full-bleed background.
                  The SVG bg uses 100vw to break out of every parent container
                  and go truly edge-to-edge. The bg has a fixed tall height that
                  always extends well past the cards — it doesn't shrink/grow
                  with card content. Cards sit on top in the white zone. */}
              <div className="relative mt-4 overflow-visible">
                {/* Background SVG — viewport-wide, starts at top-[120px],
                    extends a fixed 900px downward regardless of card height.
                    This ensures the gradient always has room below the cards. */}
                <div
                  className="pointer-events-none absolute top-[60px] left-1/2 h-[900px] w-screen -translate-x-1/2"
                  aria-hidden
                >
                  <Image
                    src="/offerLogos/offer-bg-var-a.svg"
                    alt=""
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>

                {/* Content — above the background */}
                <div className="relative z-10 px-4 pt-8 pb-40 xl:px-12">
                  {/* Responsive grid: 2 cols at lg, 3 cols at xl+ */}
                  <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
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
                          footer={
                            offer.advantages ? (
                              <OfferAdvantagesAccordion
                                triggerLabel="Ce qui est inclu"
                                value={offer.plan}
                                lines={offer.advantages as AdvantageLineItem[]}
                              />
                            ) : undefined
                          }
                        />
                      </OfferCardHoverGroup>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PricingErrorDrawer open={errorOpen} onOpenChange={setErrorOpen} />
    </>
  );
}
