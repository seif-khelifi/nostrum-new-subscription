"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { VariantConfig, VariantKey, StepTexts, StepId } from "@/config";
import { resolveVariant } from "@/config";

/* ------------------------------------------------------------------ */
/*  Variant assignment (session-sticky)                               */
/* ------------------------------------------------------------------ */

const VARIANT_STORAGE_KEY = "nostrum_variant";

/**
 * Get or assign a random variant for this session.
 * Once assigned, the same variant is returned for the entire session.
 *
 * This replaces the old `getOrAssignVariant` in StepperContext —
 * one variant now controls everything (pages, texts, banners, step order).
 */
function getOrAssignVariant(): VariantKey {
  if (typeof window === "undefined") return "a";
  try {
    const stored = sessionStorage.getItem(VARIANT_STORAGE_KEY);
    // if (stored === "a" || stored === "b") return stored;
    const variant: VariantKey = Math.random() < 0.1 ? "a" : "b";
    sessionStorage.setItem(VARIANT_STORAGE_KEY, variant);
    console.log("[variant] Assigned variant:", variant);
    return variant;
  } catch {
    return "a";
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const VariantContext = createContext<VariantConfig | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

interface VariantProviderProps {
  children: ReactNode;
  /** Force a specific variant (useful for testing / Storybook). */
  forceVariant?: VariantKey;
}

export function VariantProvider({
  children,
  forceVariant,
}: VariantProviderProps) {
  const [config] = useState<VariantConfig>(() =>
    resolveVariant(forceVariant ?? getOrAssignVariant()),
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
 * Convenience hook: get the text overrides for a specific step.
 * Returns `undefined` when the active variant has no overrides for that step,
 * so the component can fall back to its hardcoded defaults.
 */
export function useStepTexts(stepId: StepId): StepTexts | undefined {
  const { texts } = useVariant();
  return texts[stepId];
}
