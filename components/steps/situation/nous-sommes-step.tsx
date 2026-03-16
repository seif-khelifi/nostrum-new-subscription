"use client";

import { useState } from "react";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";

export function NousSommesStep() {
	const { next } = useStepper();
	const [familyCount, setFamilyCount] = useState("");

	const canProceed = familyCount.trim().length > 0;

	return (
		<StepScreen
			title={
				<>
					Qui souhaitez-vous
					<br />
					protéger ?
				</>
			}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Je souhaite protéger</span>
					<PillInput
						readOnly
						value=""
						placeholder=""
						inputClassName="min-w-[100px] sm:min-w-[160px]"
					/>
					<span>, nous sommes</span>
					<PillInput
						type="number"
						placeholder="2"
						value={familyCount}
						onChange={(e) => setFamilyCount(e.target.value)}
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
