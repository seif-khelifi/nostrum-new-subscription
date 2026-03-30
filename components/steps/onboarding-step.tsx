"use client";

import { OnboardingHero, MobileOnboardingHero } from "@/components/onboarding";
import { useStepper } from "@/context/StepperContext";

/**
 * Step-aware wrapper for the onboarding hero.
 *
 * Desktop: renders the original OnboardingHero (hidden below sm).
 * Mobile:  renders the new MobileOnboardingHero (hidden at sm and above).
 *
 * Both call `next()` from the stepper when the user clicks the CTA.
 */
export function OnboardingStep() {
  const { next } = useStepper();

  return (
    <>
      {/* Desktop hero — hidden on mobile */}
      <div className="hidden sm:block h-full">
        <OnboardingHero onStart={next} />
      </div>

      {/* Mobile hero — hidden on desktop */}
      <MobileOnboardingHero onStart={next} />
    </>
  );
}
