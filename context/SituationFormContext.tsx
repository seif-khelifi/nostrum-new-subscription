"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { type SituationFormData, INITIAL_SITUATION } from "@/types/subscription";

interface SituationFormContextValue {
	/** The full form data object */
	formData: SituationFormData;
	/** Whether sessionStorage has been hydrated */
	isReady: boolean;
	/** Merge a partial update into the form data */
	updateFormData: (patch: Partial<SituationFormData>) => void;
	/** Reset form to initial state and clear storage */
	resetFormData: () => void;
}

const SituationFormContext = createContext<SituationFormContextValue | null>(null);

export function SituationFormProvider({ children }: { children: ReactNode }) {
	const {
		value: formData,
		setValue: setFormData,
		removeValue: resetFormData,
		isReady,
	} = useSessionStorage<SituationFormData>("subscription_situation", INITIAL_SITUATION);

	const updateFormData = useCallback(
		(patch: Partial<SituationFormData>) => {
			setFormData({ ...formData, ...patch });
		},
		[formData, setFormData],
	);

	return (
		<SituationFormContext.Provider value={{ formData, isReady, updateFormData, resetFormData }}>
			{children}
		</SituationFormContext.Provider>
	);
}

export function useSituationForm() {
	const ctx = useContext(SituationFormContext);
	if (!ctx) {
		throw new Error("useSituationForm must be used within a SituationFormProvider");
	}
	return ctx;
}
