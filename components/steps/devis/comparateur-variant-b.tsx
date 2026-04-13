"use client";

import { capitalize } from "@/lib/utils";
import { type OfferPlan, OFFER_OPTIONS, LEGEND_ITEMS } from "@/lib/plans";
import type { CategoryMeta, TabBreakdowns, OfferTabs, AllTabs } from "@/types/garanties";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowLeft, Info as InfoIcon } from "lucide-react";
import { OfferCard } from "@/components/ui/offer-card";
import { PlanLogo } from "@/components/ui/plan-logo";
import { GarantieCompareBreakdownCard } from "@/components/ui/garantie-compare-breakdown-card";
import type { CompareOfferItem } from "@/components/ui/garantie-compare-breakdown-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OfferSwitchGrid } from "@/components/ui/offer-switch-grid";
import { AlertBanner } from "@/components/ui/alert";
import offersData from "@/data/offers.json";
import garantiesData from "@/data/garanties-variant-b.json";

const categories: CategoryMeta[] = garantiesData.categories as CategoryMeta[];
const tabsData: AllTabs = garantiesData.tabs as AllTabs;

/* ------------------------------------------------------------------ */
/*  ComparateurVariantB                                               */
/* ------------------------------------------------------------------ */

export function ComparateurVariantB() {
  const { dismissSubFlow } = useStepper();
  const { value: storedCompareOffers, setValue: setStoredCompareOffers } =
    useSessionStorage<string[]>("compareOffers", []);

  // Fallback to ["bronze", "silver"] for development preview if empty
  const compareOffersIds = storedCompareOffers?.length
    ? storedCompareOffers
    : ["bronze", "silver"];

  const toggleOffer = (plan: string) => {
    const current = new Set(compareOffersIds);
    if (current.has(plan)) {
      if (current.size > 1) {
        current.delete(plan);
        setStoredCompareOffers(Array.from(current));
      }
    } else {
      current.add(plan);
      setStoredCompareOffers(Array.from(current));
    }
  };

  // Map IDs to actual offer data
  const selectedOffers = compareOffersIds.map((id) => {
    return offersData.offers.find((o) => o.plan === id) || offersData.offers[1];
  });

  /** Render all 5 category sections for a given tab key */
  const renderTabCategories = (
    tabKey: "sante" | "bienetre",
    isDesktop = false,
  ) => {
    return (
      <div className={isDesktop ? "flex flex-col gap-4" : "-mx-4 sm:-mx-6"}>
        {categories.map((cat, idx) => {
          // Build the offers array for this category
          const categoryOffers: CompareOfferItem[] = selectedOffers.map(
            (offer) => {
              const planName = offer.plan;
              const offerTabs: OfferTabs =
                tabsData[planName] ?? tabsData.silver;
              const breakdowns: TabBreakdowns = offerTabs[tabKey] ?? {};
              const breakdown = breakdowns[cat.key] ?? {};

              return {
                offerLabel: capitalize(planName),
                breakdown,
              };
            },
          );

          return (
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

              {/* Compare Breakdown card */}
              <div className="mt-4">
                <GarantieCompareBreakdownCard offers={categoryOffers} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ─── Mobile layout (<lg) ─── */}
      <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto overflow-x-hidden bg-white lg:hidden">
        {/* ── Top section ── */}
        <div className="bg-[#25003C] px-4 pt-6 pb-8 sm:px-6">
          <div className="mb-6 mt-2 flex justify-center">
            <Button
              variant="closeComparateur"
              onClick={() => dismissSubFlow()}
>
              Fermer le comparateur d{"'"}offres
              <span className="flex h-[26px] w-[42px] items-center justify-center rounded-full bg-[#360057] transition-colors hover:bg-[#4a0076]">
                <X className="h-4 w-4 text-[#F3E5FA]" />
              </span>
            </Button>
          </div>

          <h1 className="mt-2 font-[family-name:var(--font-bricolage-grotesque)] text-3xl font-bold leading-tight text-white pr-8">
            Même soins. Pas le même résultat.
          </h1>

          <p className="mt-4 text-[15px] leading-relaxed text-white opacity-90 pr-4">
            Moins de reste, plus de sérénité sur vos soins.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {selectedOffers.map((offer) => (
              <OfferCard
                key={offer.plan}
                plan={offer.plan as OfferPlan}
                tone="default"
                size="default"
                price={offer.price}
                period={offer.period}
                descriptionTitle={offer.descriptionTitle ?? ""}
                description={""}
                hideCta
                logo={<PlanLogo plan={offer.plan} />}
              />
            ))}
          </div>
        </div>

        {/* ── Legend + Tabs section ── */}
        <div className="px-4 pt-8 pb-12 sm:px-6">
          {/* Title */}
          <p className="text-base font-semibold text-[#290E67]">
            Projetez-vous dans vos prochains soins
          </p>

          {/* Subtitle */}
          <p className="mt-1 text-sm text-[#1D1B20]">
            Simulez vos soins habituels et voyez votre reste à charge.
          </p>

          {/* Legend — single line */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-4 rounded-full shrink-0"
                  style={item.style}
                />
                <span className="text-[11px] font-medium text-[#1D1B20]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-6">
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
      </div>

      {/* ─── Desktop layout (lg+) ─── */}
      <div className="hidden lg:flex w-full bg-[#F6F4F0] min-h-screen">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto py-10 w-full px-4 lg:px-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* "Vos remboursements" card with OfferCards */}
            <Card variant="comparateurOutline">
              <h1 className="font-bold text-black mb-6 text-xl text-center md:text-left">
                Vos remboursements
              </h1>

              {/* 2×2 offer switch grid */}
              <OfferSwitchGrid offers={OFFER_OPTIONS} selected={compareOffersIds} onToggle={toggleOffer} className="mb-6" />

              <div className="flex flex-col gap-4 mb-8">
                {selectedOffers.map((offer) => (
                  <OfferCard
                    key={offer.plan}
                    plan={offer.plan as OfferPlan}
                    tone="default"
                    size="default"
                    price={offer.price}
                    period={offer.period}
                    descriptionTitle={offer.descriptionTitle ?? ""}
                    description={""}
                    hideCta
                    logo={<PlanLogo plan={offer.plan} />}
                  />
                ))}
              </div>

              {/* "Revenir aux offres" button */}
              <div className="mt-auto">
                <Button
                  variant="revenirOffres"
                  onClick={() => dismissSubFlow()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Revenir aux offres
                </Button>
              </div>
            </Card>

            {/* AlertBanner Info Popup */}
            <div className="mt-2 text-left">
              <AlertBanner
                variant="info"
                title="Nostrum Care rembourse plus de 40 médecines douces:"
                subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
                icon={<InfoIcon className="size-5 text-[#9000E3]" />}
              />
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* "Votre comparatif" card */}
            <Card
              variant="dark"
              className="flex flex-col justify-start min-h-[140px]"
            >
              <h1 className="text-3xl font-bold font-[family-name:var(--font-bricolage-grotesque)] leading-tight">
                Votre comparatif
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
