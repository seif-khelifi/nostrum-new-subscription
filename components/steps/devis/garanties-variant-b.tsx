"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { GarantiesCompareDrawer } from "./drawers";
import { OfferCard, CompareCard } from "@/components/ui/offer-card";
import type { OfferPlan } from "@/lib/plans";
import { PLAN_INDEX, LEGEND_ITEMS } from "@/lib/plans";
import { capitalize } from "@/lib/utils";
import type {
  CategoryMeta,
  TabBreakdowns,
  OfferTabs,
  AllTabs,
} from "@/types/garanties";
import { PlanLogo } from "@/components/ui/plan-logo";
import { GarantieBreakdownCard } from "@/components/ui/garantie-breakdown-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import offersData from "@/data/offers.json";
import garantiesData from "@/data/garanties-variant-b.json";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const OFFER_BG_COLORS: Record<string, string> = garantiesData.offerColors;

const categories: CategoryMeta[] = garantiesData.categories as CategoryMeta[];
const tabsData: AllTabs = garantiesData.tabs as AllTabs;

/* ------------------------------------------------------------------ */
/*  GarantiesVariantB                                                  */
/* ------------------------------------------------------------------ */

export function GarantiesVariantB() {
  const { goToStepById } = useStepper();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { value: selectedOfferIndex } = useSessionStorage<number | null>(
    "selectedOffer",
    null,
  );
  const { value: moreOfferIndex } = useSessionStorage<number | null>(
    "moreOffer",
    null,
  );

  const offerIndex = moreOfferIndex ?? selectedOfferIndex ?? 2;
  const offer = offersData.offers[offerIndex];
  const planName = offer?.plan ?? "silver";
  const bgColor = OFFER_BG_COLORS[planName] ?? "#F4F3FA";
  const compare = offersData.compareCard;
  const common = garantiesData.common;

  // Also persist price in session storage
  const { setValue: setSelectedOffer } = useSessionStorage<number | null>(
    "selectedOffer",
    null,
  );
  const { setValue: setSelectedPrice } = useSessionStorage<string | null>(
    "selectedOfferPrice",
    null,
  );

  // Resolve tab data for the current offer
  const offerTabs: OfferTabs = tabsData[planName] ?? tabsData.silver;
  const offerLabel = capitalize(planName);

  const handleChooseOffer = () => {
    setSelectedOffer(PLAN_INDEX[planName] ?? 0);
    setSelectedPrice(offer?.price ?? null);
    goToStepById("options");
  };

  /** Render all 5 category sections for a given tab key */
  const renderTabCategories = (
    tabKey: "sante" | "bienetre",
    isDesktop = false,
  ) => {
    const breakdowns: TabBreakdowns = offerTabs[tabKey] ?? {};
    return (
      <div className={isDesktop ? "flex flex-col gap-4" : "-mx-4 sm:-mx-6"}>
        {categories.map((cat, idx) => (
          <div
            key={cat.key}
            className={
              isDesktop
                ? "bg-white rounded-[24px] p-6 shadow-sm"
                : "px-4 py-5 sm:px-6"
            }
            style={
              isDesktop
                ? undefined
                : { backgroundColor: idx % 2 === 0 ? "#FAF4FB" : "#FFFFFF" }
            }
          >
            {/* Icon + title */}
            <div className="flex items-center gap-2.5">
              <span className="text-[1.35rem]" aria-hidden>
                {cat.icon}
              </span>
              <p className="text-[1.35rem] font-bold leading-tight text-[#490076]">
                {cat.title}
              </p>
            </div>

            {/* Subtitle — indented to align with title text */}
            <p className="mt-1 pl-[34px] text-sm leading-relaxed text-[#1D1B20]">
              {cat.subtitle}
            </p>

            {/* Breakdown card */}
            <div className="mt-3">
              <GarantieBreakdownCard
                offerLabel={offerLabel}
                breakdown={breakdowns[cat.key] ?? {}}
              />
            </div>
          </div>
        ))}
      </div>
    );
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
          <h3 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold leading-tight text-[#290E67]">
            {common.title}
          </h3>

          <p className="mt-2 text-base font-semibold text-[#1D1B20]">
            {common.subtitleTemplate.replace("{offer}", offerLabel)}
          </p>

          <div className="mt-6">
            <OfferCard
              plan={planName as OfferPlan}
              tone="default"
              size="default"
              price={offer?.price ?? ""}
              period={offer?.period}
              descriptionTitle={offer?.descriptionTitle ?? ""}
              description={offer?.description ?? ""}
              hideCta
              logo={<PlanLogo plan={planName} />}
            />
          </div>

          <div className="mt-4 flex items-center justify-center">
            <Button variant="linkChevron" type="button">
              {common.seeGuaranteesLabel}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Legend + Tabs section ── */}
        <div className="pt-8">
          {/* Title */}
          <p className="text-base font-semibold text-[#290E67]">
            Projetez-vous dans vos prochains soins
          </p>

          {/* Subtitle */}
          <p className="mt-1 text-sm text-[#1D1B20]">
            Simulez vos soins habituels et voyez votre reste à charge.
          </p>

          {/* Legend — single line */}
          <div className="mt-3 flex items-center justify-center gap-3">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-4 rounded-full shrink-0"
                  style={item.style}
                />
                <span className="text-[11px] text-[#1D1B20]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <Tabs defaultValue="sante" className="w-full">
              <TabsList variant="essential">
                <TabsTrigger
                  value="sante"
                  variant="essential"
                  icon={<span aria-hidden>💘</span>}
                >
                  Santé essentielle
                </TabsTrigger>
                <TabsTrigger
                  value="bienetre"
                  variant="essential"
                  icon={<span aria-hidden>🧠</span>}
                >
                  Bien-être &amp; équilibre
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sante">
                {renderTabCategories("sante")}
              </TabsContent>

              <TabsContent value="bienetre">
                {renderTabCategories("bienetre")}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* ── Compare card ── */}
        <div className="pb-4 pt-6">
          <CompareCard
            title={compare.title}
            description={compare.description}
            ctaLabel={compare.ctaLabel}
            onCtaClick={() => setDrawerOpen(true)}
          />
        </div>

        {/* ── Bottom Drawer — compare offers (extracted component) ── */}
        <GarantiesCompareDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />

        {/* ── Bottom CTA ── */}
        <div className="pb-8 pt-4">
          <Button
            variant="ctaPurpleAccent"
            className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold"
            onClick={handleChooseOffer}
          >
            {common.ctaTemplate.replace("{offer}", offerLabel)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* ─── Desktop layout (lg+) ─── */}
      <div className="hidden lg:flex w-full bg-[#F6F4F0] min-h-screen">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto py-10 w-full px-4 lg:px-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* "Votre offre" card */}
            <Card variant="comparateurOutline" className="flex flex-col">
              <h1 className="font-bold text-black mb-6">Votre offre</h1>
              <OfferCard
                plan={planName as OfferPlan}
                tone="default"
                size="default"
                price={offer?.price ?? ""}
                period={offer?.period}
                descriptionTitle={offer?.descriptionTitle ?? ""}
                description={offer?.description ?? ""}
                hideCta
                logo={<PlanLogo plan={planName} />}
              />

              <div className="mt-8 flex flex-col gap-3">
                <Button variant="revenirOffres">
                  Voir le tableau de garantie
                </Button>
                <Button
                  variant="ctaPurple"
                  className="w-full min-h-[52px] h-auto py-3 rounded-[24px] px-6 text-sm font-semibold"
                  onClick={handleChooseOffer}
                >
                  Choisir cette offre
                  <Check className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>

            {/* "Comparer nos offres" card */}
            <div className="mt-2 text-left">
              <CompareCard
                variant="dark"
                title="Comparer nos offres"
                description="Découvrez en un clin d'œil l'offre Nostrum qui optimise le mieux vos remboursements."
                ctaLabel="Je compare"
                onCtaClick={() => setDrawerOpen(true)}
              />
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* "Vos Garanties" card */}
            <Card
              variant="dark"
              className="flex flex-col justify-start min-h-[140px]"
            >
              <h1 className="text-3xl font-bold font-[family-name:var(--font-bricolage-grotesque)] leading-tight">
                Vos Garanties
              </h1>
            </Card>

            {/* Tabs area */}
            <div className="w-full mt-2">
              <Tabs defaultValue="sante" className="w-full">
                <TabsList variant="essential" className="mb-6 w-full max-w-sm">
                  <TabsTrigger
                    value="sante"
                    variant="essential"
                    icon={<span aria-hidden>💘</span>}
                  >
                    Santé essentielle
                  </TabsTrigger>
                  <TabsTrigger
                    value="bienetre"
                    variant="essential"
                    icon={<span aria-hidden>🧠</span>}
                  >
                    Bien-être &amp; équilibre
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sante">
                  {renderTabCategories("sante", true)}
                </TabsContent>

                <TabsContent value="bienetre">
                  {renderTabCategories("bienetre", true)}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
