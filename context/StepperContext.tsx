"use client";

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";

export type StepId =
	| "onboarding"
	| "profil"
	| "sexe"
	| "personalInfo"
	| "mail"
	| "phoneNumber"
	| "proteger"
	| "nousSommes"
	| "commenceParQui"
	| "dateBirthConjoint"
	// santé group
	| "sante_yeux"
	| "sante_dents"
	| "sante_bien_etre"
	| "transition_offer"
	// placeholders for future groups
	| "devis_placeholder"
	| "souscription_placeholder";

export interface StepDef {
	id: StepId;
	label: string;
}

export interface StepGroup {
	id: number;
	label: string;
	steps: StepDef[];
}

export const STEP_GROUPS: StepGroup[] = [
	{
		id: 1,
		label: "Onboarding",
		steps: [{ id: "onboarding", label: "Onboarding" }],
	},
	{
		id: 2,
		label: "Situation",
		steps: [
			{ id: "profil", label: "Profil" },
			{ id: "personalInfo", label: "Informations personnelles" },
			{ id: "mail", label: "Adresse e-mail" },
			{ id: "phoneNumber", label: "Numéro de téléphone" },
			{ id: "sexe", label: "Sexe" },
			{ id: "proteger", label: "Protection" },
			{ id: "nousSommes", label: "Nous sommes" },
			{ id: "commenceParQui", label: "On commence par qui" },
			{ id: "dateBirthConjoint", label: "Date de naissance conjoint" },
		],
	},
	{
		id: 3,
		label: "Santé",
		steps: [
			{ id: "sante_yeux", label: "Yeux" },
			{ id: "sante_dents", label: "Dents" },
			{ id: "sante_bien_etre", label: "Bien-être" },
		],
	},
	{
		id: 4,
		label: "Transition",
		steps: [{ id: "transition_offer", label: "Offre de transition" }],
	},
	{
		id: 5,
		label: "Devis",
		steps: [{ id: "devis_placeholder", label: "Devis" }],
	},
	{
		id: 6,
		label: "Souscription",
		steps: [{ id: "souscription_placeholder", label: "Souscription" }],
	},
];

/** Flat ordered list of all steps (derived from groups) */
export const ALL_STEPS: StepDef[] = STEP_GROUPS.flatMap((g) => g.steps);

/* ------------------------------------------------------------------ */
/*  Context value                                                     */
/* ------------------------------------------------------------------ */

interface StepperContextValue {
	/** All step groups */
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

function getGroupForFlatIndex(groups: StepGroup[], flatIndex: number): StepGroup {
	let count = 0;
	for (const group of groups) {
		count += group.steps.length;
		if (flatIndex < count) return group;
	}
	return groups[groups.length - 1];
}

function getFirstFlatIndexOfGroup(groups: StepGroup[], groupId: number): number {
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

export function StepperProvider({ initialStep = 0, children }: StepperProviderProps) {
	const groups = STEP_GROUPS;
	const allSteps = ALL_STEPS;

	const safeInitial = initialStep >= 0 && initialStep < allSteps.length ? initialStep : 0;
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
			next,
			back,
			goToStep,
			goToStepById,
			goToGroup,
		],
	);

	return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
}

export function useStepper() {
	const context = useContext(StepperContext);
	if (!context) {
		throw new Error("useStepper must be used within a StepperProvider");
	}
	return context;
}
