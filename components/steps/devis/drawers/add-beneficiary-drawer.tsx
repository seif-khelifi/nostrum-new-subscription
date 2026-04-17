"use client";

import { useState, useCallback } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useSituationForm } from "@/context/SituationFormContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { formatBirthdate } from "@/lib/utils";
import { getPricing, fetchProductPricing, PRICING_ERROR_MESSAGE } from "@/lib/pricing";
import type { VitaBeneficiary, BeneficiaryRelationship } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { GeneralErrorDrawer } from "./general-error-drawer";
import {
	CONJOINT_MIN_AGE,
	CONJOINT_MAX_AGE,
	ENFANT_MIN_AGE,
	ENFANT_MAX_AGE,
} from "@/lib/validations/situation";
import { minAgeBirthdate, maxAgeBirthdate, childMaxBirthdate } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_CHILDREN = 4;
const MAX_BENEFICIARIES = 6; // primary + conjoint + 4 children

/* PRICING_ERROR_MESSAGE is imported from @/lib/pricing */

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AddBeneficiaryDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type DrawerStep = "choose" | "dob";

export function AddBeneficiaryDrawer({
	open,
	onOpenChange,
}: AddBeneficiaryDrawerProps) {
	const { session, updateSession } = useSituationForm();
	const { setValue: setBeneficiariesChanged } =
		useSessionStorage<boolean>("beneficiariesChanged", false);

	const [step, setStep] = useState<DrawerStep>("choose");
	const [selectedType, setSelectedType] = useState<"MARRIED" | "CHILDREN" | null>(null);
	const [dob, setDob] = useState<Date | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);

	const beneficiaries = session.beneficiaries ?? [];
	const hasConjoint = beneficiaries.some((b) => b.relationship === "MARRIED");
	const childrenCount = beneficiaries.filter((b) => b.relationship === "CHILDREN").length;
	const canAddConjoint = !hasConjoint;
	const canAddChild = childrenCount < MAX_CHILDREN && beneficiaries.length < MAX_BENEFICIARIES;

	/* ── Reset state when drawer opens/closes ── */
	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen || !open) {
				setStep("choose");
				setSelectedType(null);
				setDob(undefined);
				setLoading(false);
			}
			onOpenChange(isOpen);
		},
		[onOpenChange, open],
	);

	/* ── Select beneficiary type → go to DOB step ── */
	const handleSelectType = (type: "MARRIED" | "CHILDREN") => {
		setSelectedType(type);
		setDob(undefined);
		setStep("dob");
	};

	/* ── Back to choice step ── */
	const handleBack = () => {
		setStep("choose");
		setSelectedType(null);
		setDob(undefined);
	};

	/* ── Confirm: add beneficiary + call pricing API ── */
	const handleConfirm = async () => {
		if (!dob || !selectedType) return;

		const newBeneficiary: Partial<VitaBeneficiary> = {
			relationship: selectedType as BeneficiaryRelationship,
			birthdate: formatBirthdate(dob),
		};

		const updatedBeneficiaries = [
			...beneficiaries,
			newBeneficiary as VitaBeneficiary,
		];

		const selectedPlan = session.selectedPlan ?? 0;
		const prices = getPricing(updatedBeneficiaries);

		setLoading(true);
		try {
			const patch = await fetchProductPricing(
				updatedBeneficiaries,
				selectedPlan,
				prices,
			);
			updateSession({ ...patch, beneficiaries: patch.beneficiaries ?? updatedBeneficiaries });
			setBeneficiariesChanged(true);
			handleOpenChange(false);
		} catch (err) {
			console.error("[recap] pricing fetch failed after adding beneficiary", err);
			setErrorOpen(true);
		} finally {
			setLoading(false);
		}
	};

	/* ── Date bounds ── */
	const isConjoint = selectedType === "MARRIED";
	const minAge = isConjoint ? CONJOINT_MIN_AGE : ENFANT_MIN_AGE;
	const maxAge = isConjoint ? CONJOINT_MAX_AGE : ENFANT_MAX_AGE;
	const dateFrom = isConjoint
		? maxAgeBirthdate(CONJOINT_MAX_AGE)
		: childMaxBirthdate();
	const dateTo = isConjoint
		? minAgeBirthdate(CONJOINT_MIN_AGE)
		: new Date();

	/* ── Step 1: Choose type ── */
	if (step === "choose") {
		return (
			<>
				<ResponsiveDrawer
					open={open}
					onOpenChange={handleOpenChange}
					title="J'ajoute un bénéficiaire"
					description="On regarde ensemble ce que cette offre changerait vraiment pour vous."
					footer={
						<p className="text-center text-xs text-[#490076]/60">
							Notre couverture s{"'"}étend jusqu{"'"}à un maximum de 6 (toi, ton conjoint et 4 enfants)
						</p>
					}
				>
					<div className="px-5 py-4 flex flex-col gap-3">
						{canAddConjoint && (
							<Button
								variant="ctaPurpleDark"
								className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-[clamp(0.8rem,2.5vw,0.95rem)] font-semibold text-center leading-snug lg:min-h-12 lg:py-2.5 lg:px-4 lg:text-[clamp(0.75rem,1.1vw,0.9rem)]"
								size="none"
								onClick={() => handleSelectType("MARRIED")}
							>
								<Plus className="h-4 w-4" />
								Ajouter un conjoint
							</Button>
						)}
						{canAddChild && (
							<Button
								variant="ctaPurpleDark"
								className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-[clamp(0.8rem,2.5vw,0.95rem)] font-semibold text-center leading-snug lg:min-h-12 lg:py-2.5 lg:px-4 lg:text-[clamp(0.75rem,1.1vw,0.9rem)]"
								size="none"
								onClick={() => handleSelectType("CHILDREN")}
							>
								<Plus className="h-4 w-4" />
								Ajouter un enfant
							</Button>
						)}
						{!canAddConjoint && !canAddChild && (
							<div className="rounded-2xl border border-[#E9E3DD] px-4 py-6 text-center text-[#490076] opacity-60 text-sm">
								Nombre maximum de bénéficiaires atteint
							</div>
						)}
					</div>
				</ResponsiveDrawer>

				<GeneralErrorDrawer
					open={errorOpen}
					onOpenChange={setErrorOpen}
					message={PRICING_ERROR_MESSAGE}
				/>
			</>
		);
	}

	/* ── Step 2: DOB input ── */
	const typeLabel = isConjoint ? "conjoint(e)" : "enfant";

	return (
		<>
			<ResponsiveDrawer
				open={open}
				onOpenChange={handleOpenChange}
				title={`Ajouter un ${typeLabel}`}
				description={`Indiquez la date de naissance de votre ${typeLabel}.`}
				footer={
					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold gap-2"
						onClick={handleConfirm}
						disabled={!dob}
						loading={loading}
					>
						Confirmer
					</Button>
				}
			>
				<div className="px-5 py-6">
					{/* Back button */}
					<button
						type="button"
						onClick={handleBack}
						className="flex items-center gap-1 text-sm font-medium text-[#490076] mb-5 hover:opacity-80 transition-opacity"
					>
						<ArrowLeft className="h-4 w-4" />
						Retour
					</button>

					{/* DOB prompt */}
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-[#05061D]">
							Mon {typeLabel} est né(e) le
						</span>
						<PillDatePicker
							value={dob}
							onChange={setDob}
							placeholder="JJ/MM/AAAA"
							inputClassName="min-w-[120px] sm:min-w-[160px]"
						fromDate={dateFrom}
						toDate={dateTo}
						/>
					</div>
				</div>
			</ResponsiveDrawer>

			<GeneralErrorDrawer
				open={errorOpen}
				onOpenChange={setErrorOpen}
				message={PRICING_ERROR_MESSAGE}
			/>
		</>
	);
}
