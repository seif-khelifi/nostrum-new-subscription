"use client";

import { useStepper } from "@/context/StepperContext";
import type { StepId } from "@/context/StepperContext";
import {
	ProfilStep,
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
	RecapStep,
	EnvoiSmsStep,
	SocialSecurityStep,
	ResilierMutuelleStep,
	CurrentInsuranceStep,
	DateSignatureAncienStep,
	DateDebutNostrumStep,
} from "./situation";
import { YeuxStep, DentsStep, BienEtreStep } from "./sante";
import { OnboardingStep } from "./onboarding-step";
import { DevisVariantA, DevisVariantB } from "./devis";

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
/*  Step → Component map                                              */
/* ------------------------------------------------------------------ */

/**
 * Maps each StepId to the component that should render for it.
 * Add entries here as new step screens are implemented.
 */
const STEP_COMPONENTS: Record<StepId, React.ComponentType> = {
	// Onboarding hero
	onboarding: OnboardingStep,

	profil: ProfilStep,
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
	recap: RecapStep,
	envoiSms: EnvoiSmsStep,
	socialSecurity: SocialSecurityStep,
	resilierMutuelle: ResilierMutuelleStep,
	currentInsurance: CurrentInsuranceStep,
	dateSignatureAncien: DateSignatureAncienStep,
	dateDebutNostrum: DateDebutNostrumStep,

	// Santé group
	sante_yeux: YeuxStep,
	sante_dents: DentsStep,
	sante_bien_etre: BienEtreStep,

	// Transition offer — empty for now
	transition_offer: () => <PlaceholderScreen label="Offre de transition" />,

	// Devis — renders variant A or B based on session assignment
	devis_placeholder: DevisStep,

	// Placeholder steps — will be replaced with real screens later
	souscription_placeholder: () => <PlaceholderScreen label="Souscription" />,
};

function PlaceholderScreen({ label }: { label: string }) {
	return (
		<div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 py-16 text-center">
			<h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-[#1D1B20]">
				{label}
			</h2>
			<p className="text-[#444444]">Cette section sera bientôt disponible.</p>
		</div>
	);
}

/**
 * Renders the component for the currently active step.
 */
export function StepRouter() {
	const { currentStepDef } = useStepper();
	const Component = STEP_COMPONENTS[currentStepDef.id];

	if (!Component) {
		return (
			<div className="py-16 text-center text-red-500">
				Unknown step: {currentStepDef.id}
			</div>
		);
	}

	return <Component />;
}
