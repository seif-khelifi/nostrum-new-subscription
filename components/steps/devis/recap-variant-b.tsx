"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { useStepTexts } from "@/context/VariantContext";
import { parsePrice, formatPriceLabel, beneficiaryDisplay } from "@/lib/utils";
import { PLAN_DISPLAY_KEYS } from "@/lib/plans";
import { optionsData } from "@/lib/options";
import { getPricing, fetchProductPricing, fetchAllPlanPrices, PRICING_ERROR_MESSAGE } from "@/lib/pricing";
import { RecapOfferCard } from "@/components/ui/recap-offer-card";
import type { RecapOfferData } from "@/components/ui/recap-offer-card";
import {
  RecapSectionCard,
  RecapOptionItem,
  RecapBeneficiaryItem,
} from "@/components/ui/recap-section-card";
import { DevisSideCard } from "@/components/ui/devis-side-card";
import { RecapStickyFooter } from "@/components/ui/recap-sticky-footer";
import { TotalSummary } from "@/components/ui/total-summary";
import { HelpCtaCard } from "@/components/ui/help-cta-card";
import {
  ChangeOfferDrawer,
  ChangeOptionsDrawer,
  AddBeneficiaryDrawer,
  GeneralErrorDrawer,
} from "@/components/steps/devis/drawers";
import offersData from "@/data/offers.json";

const PLAN_KEYS = PLAN_DISPLAY_KEYS;
const PRODUCT_LOGO_SRC = "/reacp/Logo-produit.svg";

/* ------------------------------------------------------------------ */
/*  Recap Page — Variant B                                             */
/*                                                                     */
/*  Layer 3 step page — pure composition of Layer 2 UI components.     */
/*  Mobile (<lg): mirrors variant A layout (gradient RecapOfferCard).  */
/*  Desktop (lg+): 12-col grid with DevisSideCard (left) and neutral   */
/*  RecapOfferCard + sections (right).                                 */
/* ------------------------------------------------------------------ */

export function RecapVariantB() {
  const { next } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("devis_recap");

  /* ── Session storage ── */

  const { value: selectedOptions = [], setValue: setSelectedOptions } =
    useSessionStorage<string[]>("selectedOptions", []);
  const { value: beneficiariesChanged, setValue: setBeneficiariesChanged } =
    useSessionStorage<boolean>("beneficiariesChanged", false);

  /* ── Derived data ── */

  const planIndex = session.selectedPlan ?? 2;
  const planName = PLAN_KEYS[planIndex] ?? "Silver";
  const basePrice = session.plans?.[planName] ?? "0";
  const beneficiaries = session.beneficiaries ?? [];

  const allOffers: RecapOfferData[] = useMemo(() => {
    return offersData.offers.map((offer, idx) => {
      const sessionPrice = session.plans?.[PLAN_KEYS[idx]] ?? offer.price;
      return {
        plan: offer.plan,
        price: sessionPrice.includes("€") ? sessionPrice : `${sessionPrice}€`,
        period: offer.period,
        descriptionTitle: offer.descriptionTitle,
        description: offer.description,
      };
    });
  }, [session.plans]);

  const selectedOfferData = allOffers[planIndex] ?? allOffers[2];

  const totalPrice = useMemo(() => {
    let total = parsePrice(basePrice);
    for (const opt of optionsData) {
      if (selectedOptions.includes(opt.id)) total += parsePrice(opt.price);
    }
    return formatPriceLabel(total);
  }, [basePrice, selectedOptions]);

  const selectedOptionsData = useMemo(
    () => optionsData.filter((opt) => selectedOptions.includes(opt.id)),
    [selectedOptions],
  );

  /* ── Local state ── */

  const [removingIdx, setRemovingIdx] = useState<number | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [changeOfferOpen, setChangeOfferOpen] = useState(false);
  const [changeOfferLoading, setChangeOfferLoading] = useState(false);
  const [changeOptionsOpen, setChangeOptionsOpen] = useState(false);
  const [addBeneficiaryOpen, setAddBeneficiaryOpen] = useState(false);

  /* ── Handlers ── */

  function handleRemoveOption(id: string) {
    setSelectedOptions(selectedOptions.filter((opt) => opt !== id));
  }

  async function handleRemoveBeneficiary(idx: number) {
    const updated = [...beneficiaries];
    updated.splice(idx, 1);
    const prices = getPricing(updated);

    setRemovingIdx(idx);
    try {
      const patch = await fetchProductPricing(updated, planIndex, prices);
      updateSession({ ...patch, beneficiaries: patch.beneficiaries ?? updated });
      setBeneficiariesChanged(true);
    } catch (err) {
      console.error("[recap] pricing fetch failed after removing beneficiary", err);
      setErrorOpen(true);
    } finally {
      setRemovingIdx(null);
    }
  }

  async function handleChangeOffer() {
    if (!beneficiariesChanged) {
      setChangeOfferOpen(true);
      return;
    }

    setChangeOfferLoading(true);
    try {
      const patch = await fetchAllPlanPrices(beneficiaries, planIndex);
      updateSession(patch);
      setBeneficiariesChanged(false);
    } catch (err) {
      console.error("[recap] all-pricing fetch failed", err);
      setErrorOpen(true);
    } finally {
      setChangeOfferLoading(false);
    }
    setChangeOfferOpen(true);
  }

  /* ── Shared product logo for neutral tone ── */

  const productLogo = (
    <Image
      src={PRODUCT_LOGO_SRC}
      alt={`${selectedOfferData.plan} logo`}
      width={80}
      height={40}
      className="h-10 w-auto"
    />
  );

  /* ── Shared sections (used by both mobile and desktop) ── */

  const optionsSection = (
    <RecapSectionCard
      title="Vos options"
      addLabel="J'ajoute une option"
      onAdd={() => setChangeOptionsOpen(true)}
    >
      {selectedOptionsData.length > 0 ? (
        selectedOptionsData.map((opt) => (
          <RecapOptionItem
            key={opt.id}
            title={opt.title}
            description={opt.description}
            price={opt.price}
            onRemove={() => handleRemoveOption(opt.id)}
          />
        ))
      ) : (
        <div className="rounded-[24px] bg-white ring-1 ring-[#EADFF1] px-4 py-6 text-center text-[#490076] opacity-60 text-sm">
          Aucune option sélectionnée
        </div>
      )}
    </RecapSectionCard>
  );

  const beneficiariesSection = (
    <RecapSectionCard
      title="Vos informations"
      addLabel="J'ajoute un bénéficiaire"
      onAdd={() => setAddBeneficiaryOpen(true)}
      addLoading={removingIdx !== null}
    >
      {beneficiaries.map((ben, idx) => {
        let childIndex = 0;
        if (ben.relationship === "CHILDREN") {
          childIndex = beneficiaries
            .slice(0, idx + 1)
            .filter((b) => b.relationship === "CHILDREN").length;
        }
        const display = beneficiaryDisplay(ben, childIndex);
        return (
          <RecapBeneficiaryItem
            key={idx}
            name={display.name}
            dob={display.dob}
            tag={display.tag}
            isPrimary={display.isPrimary}
            loading={removingIdx === idx}
            onRemove={
              ben.relationship !== "PRIMARY_SUBSCRIBER" && removingIdx === null
                ? () => handleRemoveBeneficiary(idx)
                : undefined
            }
          />
        );
      })}
    </RecapSectionCard>
  );

  /* ── Render ── */

  return (
    <>
      {/* Drawers */}
      <ChangeOfferDrawer open={changeOfferOpen} onOpenChange={setChangeOfferOpen} />
      <ChangeOptionsDrawer open={changeOptionsOpen} onOpenChange={setChangeOptionsOpen} />
      <AddBeneficiaryDrawer open={addBeneficiaryOpen} onOpenChange={setAddBeneficiaryOpen} />
      <GeneralErrorDrawer open={errorOpen} onOpenChange={setErrorOpen} message={PRICING_ERROR_MESSAGE} />

      {/* ─── Mobile layout (<lg) — mirrors variant A ─── */}
      <div className="flex flex-col gap-5 sm:gap-8 px-2 sm:px-0 lg:hidden">
        <div className="mx-auto w-full max-w-2xl flex flex-col gap-6">
          {/* Title */}
          <div>
            <h1
              className={
                "font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#290E67] pb-2 sm:pb-4" +
                (texts.navbarTitle ? " sm:hidden" : "")
              }
            >
              {texts.title}
            </h1>
            <p className="sm:hidden text-base text-[#290E67]">
              Vous pouvez également la consulter depuis votre boîte mail.
            </p>
          </div>

          {/* Offer card — gradient tone on mobile (same as variant A) */}
          <RecapOfferCard
            tone="gradient"
            selectedOffer={selectedOfferData}
            onChangeOffer={handleChangeOffer}
            changeOfferLoading={changeOfferLoading}
          />

          {optionsSection}
          {beneficiariesSection}
        </div>

        {/* Footer image — edge-to-edge */}
        <div className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-4">
          <div className="hidden sm:block">
            <Image src="/reacp/desktop-fotter.svg" alt="" width={800} height={200} className="w-full h-auto" />
          </div>
          <div className="block sm:hidden">
            <Image src="/reacp/mobile-footer.svg" alt="" width={400} height={200} className="w-full h-auto" />
          </div>
        </div>

        {/* Mobile sticky footer */}
        <RecapStickyFooter totalPrice={totalPrice} onContinue={next} className="sm:hidden" />

        {/* Pad bottom on mobile for fixed bar */}
        <div className="h-40 sm:hidden" />
      </div>

      {/* ─── Desktop layout (lg+) ─── */}
      <div className="hidden lg:flex w-full min-h-screen">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto py-10 w-full px-4 lg:px-8">
          {/* Left Column — side card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-10">
              <DevisSideCard
                title="Détails de l'offre"
                subtitle="Vous pouvez également le consulter depuis votre boite email."
                imageSrc={PRODUCT_LOGO_SRC}
                imageAlt="Logo produit"
              >
                <TotalSummary
                  card
                  planName="Total"
                  totalPrice={totalPrice}
                  optionCount={0}
                  onContinue={next}
                  ctaLabel="Je reçois mon devis"
                />
              </DevisSideCard>
            </div>
          </div>

          {/* Right Column — content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Offer card — neutral tone on desktop */}
            <RecapOfferCard
              tone="neutral"
              selectedOffer={selectedOfferData}
              onChangeOffer={handleChangeOffer}
              changeOfferLoading={changeOfferLoading}
              logo={productLogo}
            />

            {optionsSection}
            {beneficiariesSection}

            {/* Help CTA */}
            <HelpCtaCard
              title="Besoin d'aide pour vous décider ?"
              description="Répondez à quelques questions et découvrez en moins de 2 minutes l'offre de compte pro qui correspond le mieux à votre activité."
              ctaLabel="Démarrer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
