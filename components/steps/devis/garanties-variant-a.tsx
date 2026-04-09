"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { useStepTexts } from "@/context/VariantContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { OfferCard, CompareCard } from "@/components/ui/offer-card";
import type { OfferPlan } from "@/lib/plans";
import { PLAN_INDEX } from "@/lib/plans";
import { capitalize, formatPriceLabel } from "@/lib/utils";
import { priceForPlan } from "@/lib/pricing";
import type { VitaSessionStorage } from "@/types/subscription";
import { PlanLogo } from "@/components/ui/plan-logo";
import { AlertBanner } from "@/components/ui/alert";
import {
  GarantieCard,
  type GarantieCardColorScheme,
} from "@/components/ui/garantie-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import offersData from "@/data/offers.json";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type AccordionSection = {
  value: string;
  title: string;
  description: string;
  colorScheme: string;
  cards: { title: string; description: string }[];
  detailCard?: {
    highlightText: string;
    ctaLabel: string;
    infoTitle: string;
    infoText: string;
    rightCard: { title: string; description: string };
  };
  ctaLabel?: string;
};

/* ------------------------------------------------------------------ */
/*  GarantiesVariantA                                                  */
/* ------------------------------------------------------------------ */

export function GarantiesVariantA() {
  const { goToStepById } = useStepper();
  const texts = useStepTexts("garanties");
  const extra = (texts.extra ?? {}) as {
    subtitleTemplate: string;
    seeGuaranteesLabel: string;
    ctaTemplate: string;
    offerColors: Record<string, string>;
    accordion: AccordionSection[];
  };

  const { value: selectedOfferIndex } = useSessionStorage<number | null>(
    "selectedOffer",
    null,
  );
  const { value: moreOfferIndex } = useSessionStorage<number | null>(
    "moreOffer",
    null,
  );
  const { value: session } = useSessionStorage<VitaSessionStorage>("session", {
    beneficiaries: [],
    plans: null,
    selectedPlan: null,
  });

  // Determine which offer to show: "moreOffer" (from en savoir plus),
  // then the standalone "selectedOffer" key, then session.selectedPlan
  // (set by the pricing API), and finally default to silver (index 2).
  const offerIndex =
    moreOfferIndex ?? selectedOfferIndex ?? session.selectedPlan ?? 2;
  const offer = offersData.offers[offerIndex];
  const planName = offer?.plan ?? "silver";
  const bgColor = extra.offerColors[planName] ?? "#F4F3FA";
  const compare = offersData.compareCard;

  // Read price from session storage (set by the pricing API on the devis page).
  // session.plans values are in dot notation (e.g. "101.52"); convert to display format.
  const sessionPrice = session.plans
    ? priceForPlan(session.plans, planName)
    : null;
  const displayPrice = sessionPrice
    ? formatPriceLabel(parseFloat(sessionPrice))
    : (offer?.price ?? "");

  // Accordion sections — shared across all offers
  const sections: AccordionSection[] = extra.accordion;

  const { setValue: setSelectedOffer } = useSessionStorage<number | null>(
    "selectedOffer",
    null,
  );

  const handleChooseOffer = () => {
    setSelectedOffer(PLAN_INDEX[planName] ?? 0);
    goToStepById("options");
  };

  return (
    <>
      {/* ─── Mobile layout (<lg) ─── */}
      <div className="flex flex-col lg:hidden">
        {/* ── Colored hero section ── */}
        <div
          className="-mx-4 -mt-4 px-4 pt-6 pb-8 sm:-mx-6 sm:-mt-6 sm:px-6"
          style={{ backgroundColor: bgColor }}
        >
          {/* Title */}
          <h3 className="font-[family-name:var(--font-bricolage-grotesque)] text-3xl font-bold leading-tight text-[#290E67]">
            {texts.title}
          </h3>

          {/* Subtitle */}
          <p className="mt-2 text-base text-[#290E67]">
            {extra.subtitleTemplate.replace("{offer}", capitalize(planName))}
          </p>

          {/* Offer summary card — reuses OfferCard with hideCta */}
          <div className="mt-6">
            <OfferCard
              plan={planName as OfferPlan}
              tone="default"
              size="default"
              price={displayPrice}
              period={offer?.period}
              descriptionTitle={offer?.descriptionTitle ?? ""}
              description={offer?.description ?? ""}
              hideCta
              logo={<PlanLogo plan={planName} />}
            />
          </div>

          {/* "Voir le tableau de garanties" link — uses linkChevron variant */}
          <div className="mt-4 flex items-center justify-center">
            <Button variant="linkChevron" type="button">
              {extra.seeGuaranteesLabel}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Content outside colored section ── */}

        {/* Single illustration */}
        <div className="px-2 pt-8">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/garanties/single.svg"
              alt="Garanties illustration"
              width={600}
              height={400}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        {/* ── Accordion ── */}
        <div className="pt-8">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={[sections[0]?.value]}
          >
            {sections.map((section, sectionIdx) => (
              <AccordionItem
                key={section.value}
                value={section.value}
                className="border-b-0"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  {/* Normal font (Inter), text-2xl, bold */}
                  <span className="text-2xl font-bold text-[#490076]">
                    {section.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  {/* Description */}
                  <p className="mb-6 text-sm leading-relaxed text-[#490076]">
                    {section.description}
                  </p>

                  {/* Section 1: 2 cards + full-width split card + button + info */}
                  {sectionIdx === 0 && section.detailCard ? (
                    <>
                      {/* 2 top cards */}
                      <div className="grid grid-cols-2 gap-3">
                        {section.cards.slice(0, 2).map((card) => (
                          <GarantieCard
                            key={card.title}
                            colorScheme={
                              section.colorScheme as GarantieCardColorScheme
                            }
                            title={card.title}
                            description={card.description}
                          />
                        ))}
                      </div>

                      {/* Full-width split card: left = icon card, right = white card */}
                      <div
                        className="mt-3 grid grid-cols-2 gap-2 overflow-hidden rounded-2xl p-2"
                        style={{
                          backgroundColor:
                            section.colorScheme === "purple"
                              ? "#F3E5FA"
                              : section.colorScheme === "warm"
                                ? "#FBF4EA"
                                : "#E8F3F8",
                        }}
                      >
                        {/* Left: icon card */}
                        <GarantieCard
                          colorScheme="transparent"
                          title={section.detailCard.rightCard.title}
                          description={section.detailCard.rightCard.description}
                        />

                        {/* Right: white inner card */}
                        <div className="rounded-2xl bg-white p-4">
                          <p
                            className="text-sm leading-relaxed text-[#490076]"
                            dangerouslySetInnerHTML={{
                              __html: section.detailCard.highlightText,
                            }}
                          />
                        </div>
                      </div>

                      {/* Button — extracted outside the card, with generous padding */}
                      <div className="mt-4">
                        <Button
                          variant="ctaPurple"
                          className="w-full rounded-[24px] h-12 px-6 text-sm font-semibold"
                          onClick={() => {}}
                        >
                          {section.detailCard.ctaLabel}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      {/* Info banner — reuses AlertBanner with imageSrc variant */}
                      <div className="mt-3">
                        <AlertBanner
                          variant="info"
                          size="sm"
                          title={section.detailCard.infoTitle}
                          subtitle={section.detailCard.infoText}
                          imageSrc="/alertBanner/girl.svg"
                          imageSrcHorizontal="/alertBanner/girl-hor.svg"
                          imageAlt="Girl"
                        />
                      </div>
                    </>
                  ) : (
                    /* Sections 2 & 3: grid of cards */
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {section.cards.map((card) => (
                          <GarantieCard
                            key={card.title}
                            colorScheme={
                              section.colorScheme as GarantieCardColorScheme
                            }
                            title={card.title}
                            description={card.description}
                          />
                        ))}
                      </div>

                      {/* CTA button for section 2, with generous padding */}
                      {section.ctaLabel && (
                        <div className="mt-4 flex justify-center">
                          <Button
                            variant="ctaPurple"
                            className="rounded-[24px] h-12 px-6 text-sm font-semibold"
                            onClick={() => {}}
                          >
                            {section.ctaLabel}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </AccordionContent>

                {/* Multi illustration — between section 2 and section 3 */}
                {sectionIdx === 1 && (
                  <div className="px-2 py-4">
                    <div className="overflow-hidden rounded-2xl">
                      <Image
                        src="/garanties/multi.svg"
                        alt="Multi garanties illustration"
                        width={600}
                        height={400}
                        className="h-auto w-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* ── Compare card — reuses CompareCard from devis ── */}
        <div className="pb-4 pt-6">
          <CompareCard
            title={compare.title}
            description={compare.description}
            ctaLabel={compare.ctaLabel}
            onCtaClick={() => {
              sessionStorage.setItem("comparateurOrigin", JSON.stringify("garanties"));
              goToStepById("offre_comparateur");
            }}
          />
        </div>

        {/* ── Bottom CTA — #9000E3 bg, ctaPurple variant with override ── */}
        <div className="pb-8 pt-4">
          <Button
            variant="ctaPurpleAccent"
            className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold"
            onClick={handleChooseOffer}
          >
            {extra.ctaTemplate.replace("{offer}", capitalize(planName))}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* ─── Desktop placeholder (lg+) ─── */}
      <div className="hidden items-center justify-center py-16 lg:flex flex-col gap-4">
        <p className="text-lg text-[#444444]">
          Version desktop à venir — veuillez utiliser la version mobile.
        </p>
      </div>
    </>
  );
}
