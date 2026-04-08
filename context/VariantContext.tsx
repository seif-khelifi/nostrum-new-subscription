"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { VariantConfig, VariantKey, StepTexts, StepId } from "@/config";
import { resolveVariant } from "@/config";

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const VariantContext = createContext<VariantConfig | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

interface VariantProviderProps {
  children: ReactNode;
  /**
   * The variant key resolved from the cookie (set by middleware).
   * Both server and client receive the same value, preventing hydration mismatches.
   */
  variant?: VariantKey;
  /** Force a specific variant (useful for testing / Storybook). */
  forceVariant?: VariantKey;
}

export function VariantProvider({
  children,
  variant,
  forceVariant,
}: VariantProviderProps) {
  const [config] = useState<VariantConfig>(() =>
    resolveVariant(forceVariant ?? variant ?? "a"),
  );

  return (
    <VariantContext.Provider value={config}>{children}</VariantContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */

/** Access the full variant config. */
export function useVariant(): VariantConfig {
  const ctx = useContext(VariantContext);
  if (!ctx) {
    throw new Error("useVariant must be used within a VariantProvider");
  }
  return ctx;
}

/**
 * Convenience hook: get the texts for a specific step from the variant config.
 * Throws if no entry exists — the config is the single source of truth;
 * step components must never hardcode fallback text.
 */
export function useStepTexts(stepId: StepId): StepTexts {
  const { texts } = useVariant();
  const entry = texts[stepId];
  if (!entry) {
    throw new Error(
      `[useStepTexts] No texts configured for step "${stepId}". ` +
        `Add an entry in the variant config.`,
    );
  }
  return entry;
}
