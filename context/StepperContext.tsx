"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useVariant } from "@/context/VariantContext";
import type { StepId, StepDef, StepGroup, VariantKey } from "@/config";

export type { StepId, StepDef, StepGroup };

/** @deprecated Use `VariantKey` from `@/config/variants` instead. */
export type DevisVariant = VariantKey;

/* ------------------------------------------------------------------ */
/*  Sub-flow — floating step sequence overlay                         */
/* ------------------------------------------------------------------ */

export interface SubFlow {
  /** Ordered list of floating step ids */
  steps: StepId[];
  /** Current position within the sub-flow */
  index: number;
  /** Step to navigate to when the sub-flow completes (last next()) */
  returnStepId: StepId;
  /** Main-flow flat index of the step that launched this sub-flow (for back from first step) */
  parentIndex: number;
}

/* ------------------------------------------------------------------ */
/*  Combined state — single object so functional updaters always see  */
/*  the latest values (avoids stale-closure bugs with batched calls)  */
/* ------------------------------------------------------------------ */

interface StepperState {
  activeStep: number;
  subFlow: SubFlow | null;
}

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

  /* ── Main navigation ── */
  next: () => void;
  back: () => void;
  goToStep: (index: number) => void;
  goToStepById: (id: StepId) => void;
  goToGroup: (groupId: number) => void;

  /* ── Sub-flow navigation ── */
  /** Active sub-flow, or null when navigating the main flow */
  subFlow: SubFlow | null;
  /** Launch a floating step sequence. Renders the first step immediately. */
  launchSubFlow: (steps: StepId[], returnStepId: StepId) => void;
  /** Replace the sub-flow steps array (keeps current index). Used mid-flow to reorder remaining steps. */
  updateSubFlow: (steps: StepId[]) => void;
  /** Dismiss the sub-flow and return to the step that launched it. */
  dismissSubFlow: () => void;
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

  const safeInitial =
    initialStep >= 0 && initialStep < allSteps.length ? initialStep : 0;

  // Single combined state so functional updaters always see latest values
  const [state, setState] = useState<StepperState>({
    activeStep: safeInitial,
    subFlow: null,
  });

  const { activeStep, subFlow } = state;

  /* ── Derived state ── */

  const currentStepDef: StepDef = subFlow
    ? { id: subFlow.steps[subFlow.index], label: subFlow.steps[subFlow.index] }
    : allSteps[activeStep];

  // When in a sub-flow, report the group of the parent step (so sidebar/progress stay correct)
  const currentGroup = subFlow
    ? getGroupForFlatIndex(groups, subFlow.parentIndex)
    : getGroupForFlatIndex(groups, activeStep);

  const isFirstStep = !subFlow && activeStep === 0;
  const isLastStep = !subFlow && activeStep === allSteps.length - 1;

  /* ── Navigation (all use functional updater to read latest state) ── */

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.subFlow) {
        const sf = prev.subFlow;
        if (sf.index < sf.steps.length - 1) {
          // Advance within the sub-flow
          return { ...prev, subFlow: { ...sf, index: sf.index + 1 } };
        }
        // Sub-flow complete — return to main flow at the return step
        return {
          activeStep: getFlatIndexById(allSteps, sf.returnStepId),
          subFlow: null,
        };
      }
      return { ...prev, activeStep: Math.min(prev.activeStep + 1, allSteps.length - 1) };
    });
  }, [allSteps]);

  const back = useCallback(() => {
    setState((prev) => {
      if (prev.subFlow) {
        const sf = prev.subFlow;
        if (sf.index > 0) {
          // Go to previous step in the sub-flow
          return { ...prev, subFlow: { ...sf, index: sf.index - 1 } };
        }
        // Back from first sub-flow step — return to parent
        return { activeStep: sf.parentIndex, subFlow: null };
      }
      return { ...prev, activeStep: Math.max(prev.activeStep - 1, 0) };
    });
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < allSteps.length) {
        setState({ activeStep: index, subFlow: null });
      }
    },
    [allSteps.length],
  );

  const goToStepById = useCallback(
    (id: StepId) => {
      setState({ activeStep: getFlatIndexById(allSteps, id), subFlow: null });
    },
    [allSteps],
  );

  const goToGroup = useCallback(
    (groupId: number) => {
      setState({ activeStep: getFirstFlatIndexOfGroup(groups, groupId), subFlow: null });
    },
    [groups],
  );

  /* ── Sub-flow management ── */

  const launchSubFlow = useCallback(
    (steps: StepId[], returnStepId: StepId) => {
      setState((prev) => ({
        ...prev,
        subFlow: {
          steps,
          index: 0,
          returnStepId,
          parentIndex: prev.activeStep,
        },
      }));
    },
    [],
  );

  const updateSubFlow = useCallback(
    (steps: StepId[]) => {
      setState((prev) =>
        prev.subFlow
          ? { ...prev, subFlow: { ...prev.subFlow, steps } }
          : prev,
      );
    },
    [],
  );

  const dismissSubFlow = useCallback(() => {
    setState((prev) =>
      prev.subFlow
        ? { activeStep: prev.subFlow.parentIndex, subFlow: null }
        : prev,
    );
  }, []);

  return (
    <StepperContext.Provider
      value={{
        groups,
        allSteps,
        activeStep,
        currentStepDef,
        currentGroup,
        sidebarGroupId: currentGroup.id,
        isFirstStep,
        isLastStep,
        devisVariant: variantConfig.id,
        next,
        back,
        goToStep,
        goToStepById,
        goToGroup,
        subFlow,
        launchSubFlow,
        updateSubFlow,
        dismissSubFlow,
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
