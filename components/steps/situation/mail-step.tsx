"use client";

import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";

export function MailStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const email = formData.email;

	const canProceed = email.trim().length > 0;

	return (
		<StepScreen
			title={<>Et pour vous contacter ?</>}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>{"Je souhaite recevoir un devis personnalisé à l'adresse"}</span>
					<PillInput
						type="email"
						placeholder="votre@email.com"
						value={email}
						onChange={(e) => updateFormData({ email: e.target.value })}
						inputClassName="min-w-[180px] sm:min-w-[240px]"
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
