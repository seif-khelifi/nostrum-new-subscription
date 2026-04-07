"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useSessionStorage } from "@/hooks/use-session-storage";
import {
	type VitaSessionStorage,
	type VitaBeneficiary,
	type PrimaryBeneficiary,
	INITIAL_VITA_SESSION,
} from "@/types/subscription";

interface SituationFormContextValue {
	session: VitaSessionStorage;
	isReady: boolean;
	/** Merge fields onto beneficiaries[0]. Creates it if missing. */
	updatePrimary: (patch: Partial<PrimaryBeneficiary>) => void;
	/** Update a specific beneficiary by index. */
	updateBeneficiary: (index: number, patch: Partial<VitaBeneficiary>) => void;
	/** Replace entire beneficiaries array. */
	setBeneficiaries: (beneficiaries: VitaBeneficiary[]) => void;
	/** Merge top-level session fields (plans, selectedPlan, etc.) */
	updateSession: (patch: Partial<VitaSessionStorage>) => void;
	/** Reset everything. */
	resetSession: () => void;
}

const Ctx = createContext<SituationFormContextValue | null>(null);

export function SituationFormProvider({ children }: { children: ReactNode }) {
	const {
		value: session,
		setValue: setSession,
		removeValue: resetSession,
		isReady,
	} = useSessionStorage<VitaSessionStorage>("session", INITIAL_VITA_SESSION);

	const updatePrimary = useCallback(
		(patch: Partial<PrimaryBeneficiary>) => {
			const bens = [...session.beneficiaries];
			const cur = (bens[0] ?? { relationship: "PRIMARY_SUBSCRIBER" as const }) as Partial<PrimaryBeneficiary>;
			bens[0] = { ...cur, ...patch } as PrimaryBeneficiary;
			setSession({ ...session, beneficiaries: bens });
		},
		[session, setSession],
	);

	const updateBeneficiary = useCallback(
		(index: number, patch: Partial<VitaBeneficiary>) => {
			const bens = [...session.beneficiaries];
			if (!bens[index]) return;
			bens[index] = { ...bens[index], ...patch } as VitaBeneficiary;
			setSession({ ...session, beneficiaries: bens });
		},
		[session, setSession],
	);

	const setBeneficiaries = useCallback(
		(beneficiaries: VitaBeneficiary[]) => {
			setSession({ ...session, beneficiaries });
		},
		[session, setSession],
	);

	const updateSession = useCallback(
		(patch: Partial<VitaSessionStorage>) => {
			setSession({ ...session, ...patch });
		},
		[session, setSession],
	);

	return (
		<Ctx.Provider value={{ session, isReady, updatePrimary, updateBeneficiary, setBeneficiaries, updateSession, resetSession }}>
			{children}
		</Ctx.Provider>
	);
}

export function useSituationForm() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useSituationForm must be used within SituationFormProvider");
	return ctx;
}
