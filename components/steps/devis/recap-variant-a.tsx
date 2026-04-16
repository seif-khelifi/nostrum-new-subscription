"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { useStepTexts } from "@/context/VariantContext";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { RecapOfferCard } from "@/components/ui/recap-offer-card";
import type { RecapOfferData } from "@/components/ui/recap-offer-card";
import {
  RecapSectionCard,
  RecapOptionItem,
  RecapBeneficiaryItem,
} from "@/components/ui/recap-section-card";
import { Button } from "@/components/ui/button";
import { ChangeOfferDrawer, ChangeOptionsDrawer, AddBeneficiaryDrawer, GeneralErrorDrawer } from "@/components/steps/devis/drawers";
import { getPricing, fetchProductPricing, fetchAllPlanPrices } from "@/lib/pricing";
import offersData from "@/data/offers.json";
import optionsJson from "@/data/options.json";
import type { VitaBeneficiary } from "@/types/subscription";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PLAN_KEYS = ["Découverte", "Bronze", "Silver", "Gold"] as const;
const PLAN_SLUGS = ["decouverte", "bronze", "silver", "gold"] as const;

type OptionEntry = { id: string; title: string; description: string; price: string };
const optionsData = optionsJson as OptionEntry[];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDob(raw: string): string {
  const parts = raw.split("/");
  if (parts.length === 3) return parts.join(" / ");
  return raw;
}

function beneficiaryDisplay(
  ben: VitaBeneficiary,
  relationship: string,
  childIndex: number
): { name: string; dob: string; tag: string; isPrimary: boolean } {
  if (relationship === "PRIMARY_SUBSCRIBER") {
    const firstname = (ben as { firstname?: string }).firstname ?? "";
    const lastname = (ben as { lastname?: string }).lastname ?? "";
    return {
      name: `${firstname} ${lastname}`.trim() || "Bénéficiaire",
      dob: formatDob((ben as { birthdate?: string }).birthdate ?? ""),
      tag: "Bénéficiaire principal",
      isPrimary: true,
    };
  }

  if (relationship === "MARRIED") {
    return {
      name: "Conjoint(e)",
      dob: formatDob((ben as { birthdate?: string }).birthdate ?? ""),
      tag: "Conjoint(e)",
      isPrimary: false,
    };
  }

  // CHILDREN
  return {
    name: `Enfant n°${childIndex}`,
    dob: formatDob((ben as { birthdate?: string }).birthdate ?? ""),
    tag: "Rattaché à vous et/ou conjoint(e)",
    isPrimary: false,
  };
}

/* ------------------------------------------------------------------ */
/*  Recap Page — Variant A                                             */
/*                                                                     */
/*  Pure composition page — imports UI components, wires up state,     */
/*  renders layout. Placed after options in the devis group.           */
/* ------------------------------------------------------------------ */

const PRICING_ERROR_MESSAGE =
  "Nous n'avons pas pu afficher nos tarifs pour le moment. Pas d'inquiétude, notre équipe est là pour vous aider ! Vous pouvez nous contacter directement au 01 62 45 01 05 (appel gratuit, du lundi au vendredi / 9h-19h) pour obtenir les informations dont vous avez besoin et souscrire en toute simplicité.";

export function RecapVariantA() {
  const { next, goToStepById } = useStepper();
  const { session, updateSession } = useSituationForm();
  const texts = useStepTexts("devis_recap");

  const { value: selectedOptions = [], setValue: setSelectedOptions } =
    useSessionStorage<string[]>("selectedOptions", []);
  const { value: beneficiariesChanged, setValue: setBeneficiariesChanged } =
    useSessionStorage<boolean>("beneficiariesChanged", false);

  /* ── Selected plan ── */
  const planIndex = session.selectedPlan ?? 2;
  const planName = PLAN_KEYS[planIndex] ?? "Silver";
  const basePrice = session.plans?.[planName] ?? "0";

  /* ── Build offer data from offers.json + session prices ── */
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

  /* ── Total price calculation ── */
  const totalPrice = useMemo(() => {
    let total = parsePrice(basePrice);
    optionsData.forEach((opt) => {
      if (selectedOptions.includes(opt.id)) {
        total += parsePrice(opt.price);
      }
    });
    return formatPriceLabel(total);
  }, [basePrice, selectedOptions]);

  /* ── Selected options data ── */
  const selectedOptionsData = useMemo(() => {
    return optionsData.filter((opt) => selectedOptions.includes(opt.id));
  }, [selectedOptions]);

  /* ── Beneficiary data ── */
  const beneficiaries = session.beneficiaries ?? [];

  /* ── Handlers ── */
  const handleRemoveOption = (id: string) => {
    setSelectedOptions(selectedOptions.filter((opt) => opt !== id));
  };

  const [removingIdx, setRemovingIdx] = useState<number | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleRemoveBeneficiary = useCallback(async (idx: number) => {
    const updated = [...beneficiaries];
    updated.splice(idx, 1);

    const selectedPlanIdx = session.selectedPlan ?? 0;
    const prices = getPricing(updated);

    setRemovingIdx(idx);
    try {
      const patch = await fetchProductPricing(updated, selectedPlanIdx, prices);
      updateSession({ ...patch, beneficiaries: patch.beneficiaries ?? updated });
      setBeneficiariesChanged(true);
    } catch (err) {
      console.error("[recap] pricing fetch failed after removing beneficiary", err);
      setErrorOpen(true);
    } finally {
      setRemovingIdx(null);
    }
  }, [beneficiaries, session, updateSession]);

  const [changeOfferOpen, setChangeOfferOpen] = useState(false);
  const [changeOfferLoading, setChangeOfferLoading] = useState(false);

  const handleChangeOffer = useCallback(async () => {
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
  }, [beneficiariesChanged, beneficiaries, planIndex, updateSession, setBeneficiariesChanged]);

  const [changeOptionsOpen, setChangeOptionsOpen] = useState(false);

  const handleAddOption = () => {
    setChangeOptionsOpen(true);
  };

  const [addBeneficiaryOpen, setAddBeneficiaryOpen] = useState(false);

  const handleAddBeneficiary = () => {
    setAddBeneficiaryOpen(true);
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-2 sm:px-0">
      {/* Change offer modal */}
      <ChangeOfferDrawer
        open={changeOfferOpen}
        onOpenChange={setChangeOfferOpen}
      />

      {/* Add options modal */}
      <ChangeOptionsDrawer
        open={changeOptionsOpen}
        onOpenChange={setChangeOptionsOpen}
      />

      {/* Add beneficiary modal */}
      <AddBeneficiaryDrawer
        open={addBeneficiaryOpen}
        onOpenChange={setAddBeneficiaryOpen}
      />

      {/* Pricing error drawer */}
      <GeneralErrorDrawer
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={PRICING_ERROR_MESSAGE}
      />

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

        {/* ── Section 1: Ton offre choisie ── */}
        <RecapOfferCard
          selectedOffer={selectedOfferData}
          onChangeOffer={handleChangeOffer}
          changeOfferLoading={changeOfferLoading}
        />

        {/* ── Section 2: Vos options ── */}
        <RecapSectionCard
          title="Vos options"
          addLabel="J'ajoute une option"
          onAdd={handleAddOption}
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

        {/* ── Section 3: Vos informations ── */}
        <RecapSectionCard
          title="Vos informations"
          addLabel="J'ajoute un bénéficiaire"
          onAdd={handleAddBeneficiary}
          addLoading={removingIdx !== null}
        >
          {beneficiaries.map((ben, idx) => {
            let childIndex = 0;
            if (ben.relationship === "CHILDREN") {
              childIndex =
                beneficiaries
                  .slice(0, idx + 1)
                  .filter((b) => b.relationship === "CHILDREN").length;
            }
            const display = beneficiaryDisplay(
              ben,
              ben.relationship,
              childIndex
            );
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

      {/* ── Footer image — edge-to-edge (breaks out of main padding) ── */}
      <div className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-4">
        {/* Desktop */}
        <div className="hidden sm:block">
          <Image
            src="/reacp/desktop-fotter.svg"
            alt=""
            width={800}
            height={200}
            className="w-full h-auto"
          />
        </div>
        {/* Mobile */}
        <div className="block sm:hidden">
          <Image
            src="/reacp/mobile-footer.svg"
            alt=""
            width={400}
            height={200}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* ── Mobile sticky footer ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white ring-1 ring-[#EADFF1] z-10">
        <div className="p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="font-bold text-[#9000E3] text-[1.1rem] leading-none">
                Total
              </div>
              <div className="mt-1 flex items-end gap-0.5">
                <span className="font-bold tracking-tight text-[#9000E3] text-[2rem] leading-none">
                  {totalPrice}
                </span>
                <span className="font-semibold text-[#490076] mb-0.5 text-sm">
                  /mois
                </span>
              </div>
            </div>
            <Image
              src="/drawers/drawer-garanties-b.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0"
            />
          </div>

          <Button
            variant="ctaPurpleAccent"
            size="cta"
            className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-sm font-semibold"
            onClick={next}
          >
            Je reçois mon devis
          </Button>
        </div>
      </div>

      {/* Pad bottom on mobile for fixed bar */}
      <div className="h-40 sm:hidden" />
    </div>
  );
}
