"use client";

import { OnboardingHero } from "@/components/onboarding";
import { useStepper } from "@/context/StepperContext";

/**
 * Step-aware wrapper for the onboarding hero.
 * Calls `next()` from the stepper when the user clicks "C'est parti".
 */
export function OnboardingStep() {
	const { next } = useStepper();

	return <OnboardingHero onStart={next} />;
}
