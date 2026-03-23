"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
	type ReactNode,
} from "react";

export type StepId =
	| "onboarding"
	| "profil"
	| "sexe"
	| "personalInfo"
	| "mail"
	| "phoneNumber"
	| "address"
	| "birthPlace"
	| "proteger"
	| "nousSommes"
	| "commenceParQui"
	| "dateBirthConjoint"
	// compte (recap + SMS verification)
	| "recap"
	| "envoiSms"
	// santé group
	| "sante_yeux"
	| "sante_dents"
	| "sante_bien_etre"
	| "transition_offer"
	// placeholders for future groups
	| "devis_placeholder"
	// souscription steps
	| "socialSecurity"
	| "resilierMutuelle"
	| "currentInsurance"
	| "dateSignatureAncien"
	| "dateDebutNostrum"
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
		steps: [
			{ id: "sexe", label: "Sexe" },
			{ id: "recap", label: "Récapitulatif" },
			{ id: "envoiSms", label: "Vérification SMS" },
			{ id: "address", label: "Adresse postale" },
			{ id: "birthPlace", label: "Lieu de naissance" },
			{ id: "socialSecurity", label: "Sécurité sociale" },
			{ id: "resilierMutuelle", label: "Résilier mutuelle" },
			{ id: "currentInsurance", label: "Mutuelle actuelle" },
			{ id: "dateSignatureAncien", label: "Date signature ancien contrat" },
			{ id: "dateDebutNostrum", label: "Date début contrat Nostrum" },
			{ id: "souscription_placeholder", label: "Souscription" },
		],
	},
];

/** Flat ordered list of all steps (derived from groups) */
export const ALL_STEPS: StepDef[] = STEP_GROUPS.flatMap((g) => g.steps);

/* ------------------------------------------------------------------ */
/*  Variant system                                                    */
/* ------------------------------------------------------------------ */

export type DevisVariant = "a" | "b";

const VARIANT_STORAGE_KEY = "nostrum_devis_variant";

/**
 * Get or assign a random devis variant for this session.
 * Once assigned, the same variant is returned for the entire session.
 */
function getOrAssignVariant(): DevisVariant {
	if (typeof window === "undefined") return "a";
	try {
		const stored = sessionStorage.getItem(VARIANT_STORAGE_KEY);
		if (stored === "a" || stored === "b") return stored;
		const variant: DevisVariant = Math.random() < 0.5 ? "a" : "b";
		sessionStorage.setItem(VARIANT_STORAGE_KEY, variant);
		console.log("Assigned devis variant:", variant);
		return variant;
	} catch {
		return "a";
	}
}

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

	/** The devis variant assigned to this session ("a" or "b") */
	devisVariant: DevisVariant;

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

	// Assign a random devis variant once per session
	const [devisVariant] = useState<DevisVariant>(getOrAssignVariant);

	// ── Browser history sync ──────────────────────────────────────────
	// We use a ref to track whether a state change came from popstate
	// (browser back/forward) so we don't push a duplicate history entry.
	const isPopstateRef = useRef(false);

	// Push a history entry whenever the step changes (unless it was
	// triggered by the browser back/forward button itself).
	useEffect(() => {
		if (isPopstateRef.current) {
			// This change was caused by popstate — don't push again
			isPopstateRef.current = false;
			return;
		}
		// Push the step index into history state so popstate can read it
		window.history.pushState({ step: activeStep }, "");
	}, [activeStep]);

	// Listen for browser back/forward and sync the stepper
	useEffect(() => {
		function handlePopState(event: PopStateEvent) {
			const state = event.state as { step?: number } | null;
			if (state && typeof state.step === "number") {
				isPopstateRef.current = true;
				setActiveStep(state.step);
			} else {
				// No state — user went back past the first step.
				// Go to step 0 (or you could let the browser navigate away).
				isPopstateRef.current = true;
				setActiveStep(0);
			}
		}

		window.addEventListener("popstate", handlePopState);

		// Seed the initial history entry so the first back press works
		window.history.replaceState({ step: activeStep }, "");

		return () => window.removeEventListener("popstate", handlePopState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run once on mount

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
		// Use browser history.back() so the popstate handler syncs the step.
		// This prevents the double-action bug where setActiveStep + popstate
		// both fire and the user ends up going back two steps.
		if (typeof window !== "undefined" && window.history.length > 1) {
			window.history.back();
		} else {
			setActiveStep((prev) => Math.max(prev - 1, 0));
		}
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
			devisVariant,
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
			devisVariant,
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
