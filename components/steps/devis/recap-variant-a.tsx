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
import { RecapStickyFooter } from "@/components/ui/recap-sticky-footer";
import {
  ChangeOfferDrawer,
  ChangeOptionsDrawer,
  AddBeneficiaryDrawer,
  GeneralErrorDrawer,
} from "@/components/steps/devis/drawers";
import offersData from "@/data/offers.json";

const PLAN_KEYS = PLAN_DISPLAY_KEYS;

/* ------------------------------------------------------------------ */
/*  Recap Page — Variant A                                             */
/*                                                                     */
/*  Pure composition page — imports UI components, wires up state,     */
/*  renders layout. Placed after options in the devis group.           */
/* ------------------------------------------------------------------ */

export function RecapVariantA() {
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

  /* ── Render ── */

  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-2 sm:px-0">
      {/* Drawers */}
      <ChangeOfferDrawer open={changeOfferOpen} onOpenChange={setChangeOfferOpen} />
      <ChangeOptionsDrawer open={changeOptionsOpen} onOpenChange={setChangeOptionsOpen} />
      <AddBeneficiaryDrawer open={addBeneficiaryOpen} onOpenChange={setAddBeneficiaryOpen} />
      <GeneralErrorDrawer open={errorOpen} onOpenChange={setErrorOpen} message={PRICING_ERROR_MESSAGE} />

      {/* Centered content container */}
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

        {/* Section 1: Offer */}
        <RecapOfferCard
          selectedOffer={selectedOfferData}
          onChangeOffer={handleChangeOffer}
          changeOfferLoading={changeOfferLoading}
        />

        {/* Section 2: Options */}
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

        {/* Section 3: Beneficiaries */}
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
  );
}
