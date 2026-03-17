"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import type { ProtegerValue } from "@/types/subscription";

const OPTIONS = [
	{ value: "moi", label: "Seulement moi" },
	{ value: "conjoint_et_moi", label: "Mon conjoint(e) et moi" },
	{ value: "enfants_et_moi", label: "Mes enfants et moi" },
	{ value: "famille", label: "Toute ma famille" },
] as const;

export function ProtegerStep() {
	const { goToStepById } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const selected = formData.proteger;

	const selectedLabel = selected ? (OPTIONS.find((o) => o.value === selected)?.label ?? "") : "";

	const handleNext = () => {
		if (!selected) return;

		switch (selected) {
			case "moi":
				// seulement moi → go to santé
				goToStepById("sante_yeux");
				break;
			case "conjoint_et_moi":
			case "enfants_et_moi":
			case "famille":
				// all others → nous sommes (family count)
				goToStepById("nousSommes");
				break;
		}
	};

	return (
		<StepScreen
			title={<>Qui souhaitez-vous protéger ?</>}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Je souhaite protéger</span>
					<PillInput
						readOnly
						value={selectedLabel}
						placeholder=""
						inputClassName="min-w-[100px] sm:min-w-[160px]"
					/>
				</div>
			}
			canProceed={selected !== null}
			onNext={handleNext}
		>
			{OPTIONS.map((opt) => (
				<Button
					key={opt.value}
					variant="selectOption"
					size="select"
					selected={selected === opt.value}
					onClick={() => updateFormData({ proteger: opt.value as ProtegerValue })}
					className="justify-between"
				>
					<span>{opt.label}</span>
					{selected === opt.value && (
						<span className="flex size-5 sm:size-6 items-center justify-center rounded-full bg-[#490076] text-white">
							<Check className="size-3 sm:size-3.5" />
						</span>
					)}
				</Button>
			))}
		</StepScreen>
	);
}
