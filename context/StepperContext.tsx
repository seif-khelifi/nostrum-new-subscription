"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useVariant } from "@/context/VariantContext";
import type { StepId, StepDef, StepGroup, SkipRule, VariantKey } from "@/config";

export type { StepId, StepDef, StepGroup };

/** @deprecated Use `VariantKey` from `@/config/variants` instead. */
export type DevisVariant = VariantKey;

/* ------------------------------------------------------------------ */
/*  Context value                                                     */
/* ------------------------------------------------------------------ */

interface StepperContextValue {
  groups: StepGroup[];
  allSteps: StepDef[];
  activeStep: number;
  currentStepDef: StepDef;
  currentGroup: StepGroup;
  sidebarGroupId: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  /** @deprecated Read from `useVariant().id` instead. */
  devisVariant: VariantKey;
  next: () => void;
  back: () => void;
  goToStep: (index: number) => void;
  goToStepById: (id: StepId) => void;
  goToGroup: (groupId: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getGroupForFlatIndex(
  groups: StepGroup[],
  flatIndex: number,
): StepGroup {
  let count = 0;
  for (const group of groups) {
    count += group.steps.length;
    if (flatIndex < count) return group;
  }
  return groups[groups.length - 1];
}

function getFirstFlatIndexOfGroup(
  groups: StepGroup[],
  groupId: number,
): number {
  let index = 0;
  for (const group of groups) {
    if (group.id === groupId) return index;
    index += group.steps.length;
  }
  return 0;
}

function getFlatIndexById(allSteps: StepDef[], id: StepId): number {
  const idx = allSteps.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}

/** Read a field from the persisted situation form in sessionStorage. */
function getSituationField(field: string): string | null {
  try {
    const raw = sessionStorage.getItem("subscription_situation");
    if (!raw) return null;
    return JSON.parse(raw)[field] ?? null;
  } catch {
    return null;
  }
}

/**
 * Find the first skip rule that matches the current step and form state.
 *
 * - `next()` calls this with `direction: "forward"` → matches on `rule.from`
 * - `back()` calls this with `direction: "backward"` → matches on `rule.target`
 */
function findMatchingSkipRule(
  rules: SkipRule[],
  currentId: StepId,
  direction: "forward" | "backward",
): SkipRule | undefined {
  return rules.find((rule) => {
    const stepMatch =
      direction === "forward"
        ? rule.from === currentId
        : rule.target === currentId;
    return stepMatch && getSituationField(rule.field) === rule.value;
  });
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export function StepperProvider({
  initialStep = 0,
  children,
}: {
  initialStep?: number;
  children: ReactNode;
}) {
  const variantConfig = useVariant();
  const groups = variantConfig.stepGroups;
  const allSteps = groups.flatMap((g) => g.steps);
  const skipRules = variantConfig.skipRules ?? [];

  const safeInitial =
    initialStep >= 0 && initialStep < allSteps.length ? initialStep : 0;
  const [activeStep, setActiveStep] = useState(safeInitial);

  const currentStepDef = allSteps[activeStep];
  const currentGroup = getGroupForFlatIndex(groups, activeStep);

  function next() {
    setActiveStep((prev) => {
      const currentId = allSteps[prev]?.id;
      if (currentId) {
        const rule = findMatchingSkipRule(skipRules, currentId, "forward");
        if (rule) return getFlatIndexById(allSteps, rule.target);
      }
      return Math.min(prev + 1, allSteps.length - 1);
    });
  }

  function back() {
    setActiveStep((prev) => {
      const currentId = allSteps[prev]?.id;
      if (currentId) {
        const rule = findMatchingSkipRule(skipRules, currentId, "backward");
        if (rule) return getFlatIndexById(allSteps, rule.from);
      }
      return Math.max(prev - 1, 0);
    });
  }

  function goToStep(index: number) {
    if (index >= 0 && index < allSteps.length) setActiveStep(index);
  }

  function goToStepById(id: StepId) {
    setActiveStep(getFlatIndexById(allSteps, id));
  }

  function goToGroup(groupId: number) {
    setActiveStep(getFirstFlatIndexOfGroup(groups, groupId));
  }

  return (
    <StepperContext.Provider
      value={{
        groups,
        allSteps,
        activeStep,
        currentStepDef,
        currentGroup,
        sidebarGroupId: currentGroup.id,
        isFirstStep: activeStep === 0,
        isLastStep: activeStep === allSteps.length - 1,
        devisVariant: variantConfig.id,
        next,
        back,
        goToStep,
        goToStepById,
        goToGroup,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
}

export function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within a StepperProvider");
  return ctx;
}
