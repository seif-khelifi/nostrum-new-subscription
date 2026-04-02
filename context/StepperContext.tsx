"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { useVariant } from "@/context/VariantContext";
import type { StepId, StepDef, StepGroup, VariantKey } from "@/config";

// Re-export types so existing imports from StepperContext keep working
export type { StepId, StepDef, StepGroup };

/**
 * @deprecated Use `VariantKey` from `@/config/variants` instead.
 * Kept for backward compatibility during migration.
 */
export type DevisVariant = VariantKey;

/* ------------------------------------------------------------------ */
/*  Context value                                                     */
/* ------------------------------------------------------------------ */

interface StepperContextValue {
  /** All step groups (from the active variant config) */
  groups: StepGroup[];
  /** Flat list of all steps */
  allSteps: StepDef[];
  /** Current flat index (0-based) */
  activeStep: number;
  /** Current step definition */
  currentStepDef: StepDef;
  /** Current group (derived from activeStep) */
  currentGroup: StepGroup;
  /** Sidebar group id (1-based, derived from activeStep) */
  sidebarGroupId: number;

  isFirstStep: boolean;
  isLastStep: boolean;

  /**
   * The variant key assigned to this session ("a" or "b").
   * @deprecated Read from `useVariant().id` instead.
   */
  devisVariant: VariantKey;

  /** Advance to the next step */
  next: () => void;
  /** Go back to the previous step */
  back: () => void;
  /** Jump to a specific flat step index */
  goToStep: (index: number) => void;
  /** Jump to a step by its id */
  goToStepById: (id: StepId) => void;
  /** Jump to the first step of a sidebar group */
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

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

interface StepperProviderProps {
  initialStep?: number;
  children: ReactNode;
}

export function StepperProvider({
  initialStep = 0,
  children,
}: StepperProviderProps) {
  // Read step groups from the active variant config
  const variantConfig = useVariant();
  const groups = variantConfig.stepGroups;
  const allSteps = useMemo(() => groups.flatMap((g) => g.steps), [groups]);

  const safeInitial =
    initialStep >= 0 && initialStep < allSteps.length ? initialStep : 0;
  const [activeStep, setActiveStep] = useState(safeInitial);

  const currentStepDef = allSteps[activeStep];
  const currentGroup = useMemo(
    () => getGroupForFlatIndex(groups, activeStep),
    [groups, activeStep],
  );
  const sidebarGroupId = currentGroup.id;

  const next = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, allSteps.length - 1));
  }, [allSteps.length]);

  const back = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < allSteps.length) setActiveStep(index);
    },
    [allSteps.length],
  );

  const goToStepById = useCallback(
    (id: StepId) => {
      setActiveStep(getFlatIndexById(allSteps, id));
    },
    [allSteps],
  );

  const goToGroup = useCallback(
    (groupId: number) => {
      setActiveStep(getFirstFlatIndexOfGroup(groups, groupId));
    },
    [groups],
  );

  const value = useMemo<StepperContextValue>(
    () => ({
      groups,
      allSteps,
      activeStep,
      currentStepDef,
      currentGroup,
      sidebarGroupId,
      isFirstStep: activeStep === 0,
      isLastStep: activeStep === allSteps.length - 1,
      devisVariant: variantConfig.id,
      next,
      back,
      goToStep,
      goToStepById,
      goToGroup,
    }),
    [
      groups,
      allSteps,
      activeStep,
      currentStepDef,
      currentGroup,
      sidebarGroupId,
      variantConfig.id,
      next,
      back,
      goToStep,
      goToStepById,
      goToGroup,
    ],
  );

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
}

export function useStepper() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }
  return context;
}
