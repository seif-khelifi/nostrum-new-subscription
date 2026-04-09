"use client";

import { MobileOnboardingHero } from "@/components/onboarding";
import { useStepper } from "@/context/StepperContext";

/**
 * Step-aware wrapper for the onboarding hero.
 *
 * MobileOnboardingHero now handles both breakpoints:
 * - Mobile (< sm):  inline scrollable flow
 * - Desktop (≥ sm): fixed full-screen overlay covering navbar/sidebar
 *
 * Works identically for variant A and variant B.
 * Calls `next()` from the stepper when the user clicks the CTA.
 */
export function OnboardingStep() {
  const { next } = useStepper();

  return <MobileOnboardingHero onStart={next} />;
}
