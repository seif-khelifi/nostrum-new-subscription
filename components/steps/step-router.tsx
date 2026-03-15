"use client";

import { useStepper } from "@/context/StepperContext";
import type { StepId } from "@/context/StepperContext";
import {
	ProfilStep,
	SexeStep,
	PersonalInfoStep,
	MailStep,
	PhoneNumberStep,
} from "./situation";

/**
 * Maps each StepId to the component that should render for it.
 * Add entries here as new step screens are implemented.
 */
const STEP_COMPONENTS: Record<StepId, React.ComponentType> = {
	profil: ProfilStep,
	sexe: SexeStep,
	personalInfo: PersonalInfoStep,
	mail: MailStep,
	phoneNumber: PhoneNumberStep,

	// Placeholder steps — will be replaced with real screens later
	sante_placeholder: () => <PlaceholderScreen label="Santé" />,
	devis_placeholder: () => <PlaceholderScreen label="Devis" />,
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
