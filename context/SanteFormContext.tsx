"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { type SubscriptionUIData, INITIAL_UI } from "@/types/subscription";

interface SanteFormContextValue {
	uiData: SubscriptionUIData;
	isReady: boolean;
	updateUI: (patch: Partial<SubscriptionUIData>) => void;
	resetUI: () => void;
}

const Ctx = createContext<SanteFormContextValue | null>(null);

export function SanteFormProvider({ children }: { children: ReactNode }) {
	const {
		value: uiData,
		setValue: setUiData,
		removeValue: resetUI,
		isReady,
	} = useSessionStorage<SubscriptionUIData>("subscription_ui", INITIAL_UI);

	const updateUI = useCallback(
		(patch: Partial<SubscriptionUIData>) => {
			setUiData({ ...uiData, ...patch });
		},
		[uiData, setUiData],
	);

	return (
		<Ctx.Provider value={{ uiData, isReady, updateUI, resetUI }}>
			{children}
		</Ctx.Provider>
	);
}

export function useSanteForm() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useSanteForm must be used within SanteFormProvider");
	return ctx;
}
