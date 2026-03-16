"use client";

import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";

/** Labels matching the proteger step options */
const PROTEGER_LABELS: Record<string, string> = {
	moi: "Seulement moi",
	conjoint_et_moi: "Mon conjoint(e) et moi",
	enfants_et_moi: "Mes enfants et moi",
	famille: "Toute ma famille",
};

export function NousSommesStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const familyCount = formData.familyCount?.toString() ?? "";
	const protegerLabel = formData.proteger ? (PROTEGER_LABELS[formData.proteger] ?? "") : "";

	const canProceed = familyCount.trim().length > 0;

	return (
		<StepScreen
			title={<>Qui souhaitez-vous protéger ?</>}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Je souhaite protéger</span>
					<PillInput
						readOnly
						value={protegerLabel}
						placeholder=""
						inputClassName="min-w-[100px] sm:min-w-[160px]"
					/>
					<span>, nous sommes</span>
					<PillInput
						type="number"
						placeholder="2"
						value={familyCount}
						onChange={(e) => {
							const num = Number(e.target.value);
							updateFormData({ familyCount: Number.isNaN(num) ? null : num });
						}}
						inputClassName="min-w-[60px] sm:min-w-[80px]"
					/>
				</div>
			}
			canProceed={canProceed}
			onNext={next}
		>
			{/* No additional children — form is in subtitle */}
			<></>
		</StepScreen>
	);
}
