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
    if (stored === "a" || stored === "b") return stored;
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
