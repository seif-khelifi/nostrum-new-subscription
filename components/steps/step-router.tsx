"use client";

import { useEffect, useRef } from "react";
import { useStepper } from "@/context/StepperContext";
import { useVariant } from "@/context/VariantContext";
import type { StepId } from "@/config";
import {
  ProfilStep,
  DobStep,
  SexeStep,
  PersonalInfoStep,
  MailStep,
  PhoneNumberStep,
  AddressStep,
  BirthPlaceStep,
  ProtegerStep,
  NousSommesStep,
  CommenceParQuiStep,
  DateBirthConjointStep,
  DateBirthChildrenStep,
  RecapStep,
  EnvoiSmsStep,
  SocialSecurityStep,
  ResilierMutuelleStep,
  CurrentInsuranceStep,
  DateSignatureAncienStep,
  DateDebutNostrumStep,
} from "./situation";
import { PaymentStep } from "./souscription/payment-step";
import { CouponStep } from "./souscription/coupon-step";
import { BankDetailsStep } from "./souscription/bank-details-step";
import { ContractStep } from "./souscription/contract-step";
import { SummaryStep } from "./souscription/summary-step";
import { YeuxStep, DentsStep, BienEtreStep } from "./sante";
import { TransitionOfferStep } from "./transition";
import { OnboardingStep } from "./onboarding-step";
import {
  DevisVariantA,
  DevisVariantB,
  GarantiesVariantA,
  ComparateurVariantA,
  ComparateurVariantB,
  ComparateurWelcomeVariantA,
  OptionsVariantA,
  OptionsVariantB,
  RecapVariantA,
  RecapVariantB,
} from "./devis";

/* ------------------------------------------------------------------ */
/*  Variant-aware devis step                                          */
/* ------------------------------------------------------------------ */

/**
 * Reads the devis variant from StepperContext and renders the
 * correct variant component. No routes or URL changes involved.
 */
function DevisStep() {
  const { devisVariant } = useStepper();
  return devisVariant === "b" ? <DevisVariantB /> : <DevisVariantA />;
}

/* ------------------------------------------------------------------ */
/*  Garanties step — single component, variant-driven via useStepTexts */
/* ------------------------------------------------------------------ */

function GarantiesStep() {
  return <GarantiesVariantA />;
}

/* ------------------------------------------------------------------ */
/*  Variant-aware comparateur welcome step                             */
/* ------------------------------------------------------------------ */

function ComparateurWelcomeStep() {
  const { devisVariant } = useStepper();
  // Variant B doesn't have a separate welcome screen — skip straight to comparateur
  if (devisVariant === "b") {
    return <ComparateurVariantB />;
  }
  return <ComparateurWelcomeVariantA />;
}

/* ------------------------------------------------------------------ */
/*  Variant-aware comparateur step                                     */
/* ------------------------------------------------------------------ */

function ComparateurStep() {
  const { devisVariant } = useStepper();
  return devisVariant === "b" ? (
    <ComparateurVariantB />
  ) : (
    <ComparateurVariantA />
  );
}

/* ------------------------------------------------------------------ */
/*  Variant-aware options step                                         */
/* ------------------------------------------------------------------ */

function OptionsStep() {
  const { devisVariant } = useStepper();
  return devisVariant === "b" ? <OptionsVariantB /> : <OptionsVariantA />;
}

/* ------------------------------------------------------------------ */
/*  Variant-aware devis recap step                                     */
/* ------------------------------------------------------------------ */

function DevisRecapStep() {
  const { devisVariant } = useStepper();
  return devisVariant === "b" ? <RecapVariantB /> : <RecapVariantA />;
}

/* ------------------------------------------------------------------ */
/*  Default Step → Component map                                      */
/* ------------------------------------------------------------------ */

/**
 * Default component map. The variant config can override any of these
 * via `variantConfig.components[stepId]`.
 */
const DEFAULT_STEP_COMPONENTS: Record<StepId, React.ComponentType> = {
  // Onboarding hero
  onboarding: OnboardingStep,

  profil: ProfilStep,
  dob: DobStep,
  sexe: SexeStep,
  personalInfo: PersonalInfoStep,
  mail: MailStep,
  phoneNumber: PhoneNumberStep,
  address: AddressStep,
  birthPlace: BirthPlaceStep,
  proteger: ProtegerStep,
  nousSommes: NousSommesStep,
  commenceParQui: CommenceParQuiStep,
  dateBirthConjoint: DateBirthConjointStep,
  dateBirthChildren: DateBirthChildrenStep,
  recap: RecapStep,
  envoiSms: EnvoiSmsStep,
  socialSecurity: SocialSecurityStep,
  resilierMutuelle: ResilierMutuelleStep,
  currentInsurance: CurrentInsuranceStep,
  dateSignatureAncien: DateSignatureAncienStep,
  dateDebutNostrum: DateDebutNostrumStep,
  payment: PaymentStep,
  coupon: CouponStep,
  bankDetails: BankDetailsStep,
  contract: ContractStep,
  summary: SummaryStep,

  // Santé group
  sante_yeux: YeuxStep,
  sante_dents: DentsStep,
  sante_bien_etre: BienEtreStep,

  // Transition offer — animated carousel screen between Santé and Devis
  transition_offer: TransitionOfferStep,

  // Devis — renders variant A or B based on session assignment
  devis_placeholder: DevisStep,

  // Garanties — navigated to via "En savoir plus" from devis
  garanties: GarantiesStep,

  // Comparateur welcome — onboarding screen before the comparateur
  comparateur_welcome: ComparateurWelcomeStep,

  // Offre comparateur — compare offers side by side
  offre_comparateur: ComparateurStep,

  // Options
  options: OptionsStep,

  // Devis recap — offer summary before souscription
  devis_recap: DevisRecapStep,
};

/**
 * Renders the component for the currently active step.
 * Checks the variant config's `components` map for overrides first,
 * then falls back to the default component map.
 */
export function StepRouter() {
  const { currentStepDef, activeStep, subFlow } = useStepper();
  const { components: variantComponents } = useVariant();
  const prevStepIdRef = useRef(currentStepDef.id);

  // Variant-specific component override, or fall back to default map
  const Component =
    variantComponents?.[currentStepDef.id] ??
    DEFAULT_STEP_COMPONENTS[currentStepDef.id];

  // Scroll all scrollable containers to top on step change
  // Track by step id (works for both main-flow and sub-flow transitions)
  const currentId = currentStepDef.id;
  useEffect(() => {
    if (prevStepIdRef.current !== currentId) {
      prevStepIdRef.current = currentId;
      // Mobile shell <main> — the overflow-y-auto scroll container
      const mobileMain = document.querySelector('[data-slot="mobile-main"]');
      if (mobileMain) {
        mobileMain.scrollTop = 0;
      }
      // Desktop shell main area
      const desktopMain = document.querySelector('[data-slot="desktop-main"]');
      if (desktopMain) {
        desktopMain.scrollTop = 0;
      }
      // Fallback: window scroll
      window.scrollTo(0, 0);
    }
  }, [currentId]);

  if (!Component) {
    return (
      <div className="py-16 text-center text-red-500">
        Unknown step: {currentStepDef.id}
      </div>
    );
  }

  return <Component />;
}
