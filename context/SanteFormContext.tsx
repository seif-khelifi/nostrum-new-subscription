"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { type SanteFormData, INITIAL_SANTE } from "@/types/subscription";

interface SanteFormContextValue {
	/** The full santé form data object */
	formData: SanteFormData;
	/** Whether sessionStorage has been hydrated */
	isReady: boolean;
	/** Merge a partial update into the form data */
	updateFormData: (patch: Partial<SanteFormData>) => void;
	/** Reset form to initial state and clear storage */
	resetFormData: () => void;
}

const SanteFormContext = createContext<SanteFormContextValue | null>(null);

export function SanteFormProvider({ children }: { children: ReactNode }) {
	const {
		value: formData,
		setValue: setFormData,
		removeValue: resetFormData,
		isReady,
	} = useSessionStorage<SanteFormData>("subscription_sante", INITIAL_SANTE);

	const updateFormData = useCallback(
		(patch: Partial<SanteFormData>) => {
			setFormData({ ...formData, ...patch });
		},
		[formData, setFormData],
	);

	return (
		<SanteFormContext.Provider value={{ formData, isReady, updateFormData, resetFormData }}>
			{children}
		</SanteFormContext.Provider>
	);
}

export function useSanteForm() {
	const ctx = useContext(SanteFormContext);
	if (!ctx) {
		throw new Error("useSanteForm must be used within a SanteFormProvider");
	}
	return ctx;
}
