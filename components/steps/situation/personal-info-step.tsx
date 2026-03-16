"use client";

import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";

export function PersonalInfoStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const { firstName, lastName, birthDate } = formData;

	const canProceed =
		firstName.trim().length > 0 && lastName.trim().length > 0 && birthDate.trim().length > 0;

	return (
		<StepScreen
			title={<>Dites-nous qui vous êtes ?</>}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Je m&apos;appelle</span>
					<PillInput
						placeholder="Prénom"
						value={firstName}
						onChange={(e) => updateFormData({ firstName: e.target.value })}
						inputClassName="min-w-[100px] sm:min-w-[140px]"
					/>
					<PillInput
						placeholder="Nom"
						value={lastName}
						onChange={(e) => updateFormData({ lastName: e.target.value })}
						inputClassName="min-w-[100px] sm:min-w-[140px]"
					/>
					<span>, née le</span>
					<PillInput
						type="date"
						placeholder="JJ/MM/AAAA"
						value={birthDate}
						onChange={(e) => updateFormData({ birthDate: e.target.value })}
						inputClassName="min-w-[120px] sm:min-w-[160px]"
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
