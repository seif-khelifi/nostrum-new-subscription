"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";
import { PillInput } from "@/components/ui/pill-input";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";

export function DateBirthConjointStep() {
	const { next } = useStepper();
	const [birthDate, setBirthDate] = useState("");

	const canProceed = birthDate.trim().length > 0;

	return (
		<StepScreen
			title={
				<>
					On commence
					<br />
					par qui ?
				</>
			}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Je veux protéger en premier mon</span>
					<PillInput
						readOnly
						value=""
						placeholder=""
						inputClassName="min-w-[100px] sm:min-w-[140px]"
					/>
					<span>et il est né(e) le</span>
					<PillInput
						type="date"
						placeholder="JJ/MM/AAAA"
						value={birthDate}
						onChange={(e) => setBirthDate(e.target.value)}
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
