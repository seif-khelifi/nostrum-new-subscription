"use client";

import { Check, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import type { BienEtreValue } from "@/types/subscription";

const OPTIONS = [
	{ value: "classiques", label: "Je me limite aux soins classiques" },
	{ value: "medecines_douces", label: "J'utilise parfois des médecines douces" },
	{ value: "routine_complete", label: "J'ai une routine bien-être complète" },
] as const;

export function BienEtreStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSanteForm();

	const selected = formData.bienEtre;

	return (
		<StepScreen
			title="Et pour votre bien-être ?"
			canProceed={selected !== null}
			onNext={next}
		>
			{OPTIONS.map((opt) => (
				<Button
					key={opt.value}
					variant="selectOption"
					size="select"
					selected={selected === opt.value}
					onClick={() => updateFormData({ bienEtre: opt.value as BienEtreValue })}
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

			<AlertBanner
				variant="info"
				title="Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone."
				subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
				icon={<InfoIcon className="size-5 text-[#9000E3]" />}
				className="mt-2"
			/>
		</StepScreen>
	);
}
