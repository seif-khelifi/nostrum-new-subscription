"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";
import { PillInput } from "@/components/ui/pill-input";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";

export function PhoneNumberStep() {
	const { next } = useStepper();
	const [phone, setPhone] = useState("");

	const canProceed = phone.trim().length > 0;

	return (
		<StepScreen
			title={<>Et pour vous contacter ?</>}
			subtitle={
				<div className="flex flex-wrap items-center gap-2">
					<span>Vous pouvez aussi me joindre au</span>
					<PillInput
						type="tel"
						placeholder="06 12 34 56 78"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						inputClassName="min-w-[150px] sm:min-w-[200px]"
					/>
					<span>pour obtenir des précieux conseils.</span>
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
