"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useVariant } from "@/context/VariantContext";
import type { StepId, StepDef, StepGroup, VariantKey } from "@/config";

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
function getSituationField<K extends string>(field: K): string | null {
  try {
    const raw = sessionStorage.getItem("subscription_situation");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data[field] ?? null;
  } catch {
    return null;
  }
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
  const [activeStep, setActiveStep] = useState(safeInitial);

  const currentStepDef = allSteps[activeStep];
  const currentGroup = getGroupForFlatIndex(groups, activeStep);

  function next() {
    setActiveStep((prev) => Math.min(prev + 1, allSteps.length - 1));
  }

  function back() {
    setActiveStep((prev) => {
      const currentId = allSteps[prev]?.id;

      // Going back from sante_yeux: the forward path may have skipped
      // steps via goToStepById. Mirror those skips on the way back.
      if (currentId === "sante_yeux") {
        // "moi" skipped nousSommes, commenceParQui, dateBirthConjoint
        if (getSituationField("proteger") === "moi") {
          return getFlatIndexById(allSteps, "proteger");
        }
        // "enfant" on commenceParQui skipped dateBirthConjoint
        if (getSituationField("commenceParQui") === "enfant") {
          return getFlatIndexById(allSteps, "commenceParQui");
        }
      }

      // Going back from dateDebutNostrum: "pas_de_mutuelle" skipped
      // currentInsurance and dateSignatureAncien.
      if (
        currentId === "dateDebutNostrum" &&
        getSituationField("resilierMutuelle") === "pas_de_mutuelle"
      ) {
        return getFlatIndexById(allSteps, "resilierMutuelle");
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
