"use client";

import { InfoIcon } from "lucide-react";
import { PillInput } from "@/components/ui/pill-input";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";

/** Labels matching the commenceParQui step options */
const COMMENCE_LABELS: Record<string, string> = {
	conjoint: "Mon conjoint(e)",
	enfant: "Mon enfant",
};

export function DateBirthConjointStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const birthDate = formData.conjoint?.birthDate ?? "";
	const commenceLabel = formData.commenceParQui
		? (COMMENCE_LABELS[formData.commenceParQui] ?? "")
		: "";

	const canProceed = birthDate.trim().length > 0;

	return (
		<StepScreen
			title={<>On commence par qui ?</>}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Je veux protéger en premier mon</span>
					<PillInput
						readOnly
						value={commenceLabel}
						placeholder=""
						inputClassName="min-w-[100px] sm:min-w-[140px]"
					/>
					<span>et il est né(e) le</span>
					<PillInput
						type="date"
						placeholder="JJ/MM/AAAA"
						value={birthDate}
						onChange={(e) =>
							updateFormData({
								conjoint: { ...formData.conjoint, birthDate: e.target.value },
							})
						}
						inputClassName="min-w-[120px] sm:min-w-[160px]"
					/>
				</div>
			}
			infoCard={
				<AlertBanner
					variant="info"
					title="Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone."
					subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
					icon={<InfoIcon className="size-5 text-[#9000E3]" />}
				/>
			}
			canProceed={canProceed}
			onNext={next}
		>
			{/* No additional children — form is in subtitle */}
			<></>
		</StepScreen>
	);
}
