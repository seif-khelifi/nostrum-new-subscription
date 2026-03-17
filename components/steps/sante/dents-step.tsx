"use client";

import { Check, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSanteForm } from "@/context/SanteFormContext";
import type { DentsValue } from "@/types/subscription";

const OPTIONS = [
	{ value: "routine", label: "Un suivi de routine me suffit" },
	{ value: "soins_reguliers", label: "J'ai besoin de soins réguliers" },
	{ value: "soins_specifiques", label: "J'ai besoin de soins spécifiques" },
] as const;

export function DentsStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSanteForm();

	const selected = formData.dents;

	return (
		<StepScreen
			title={
				<>
					Et maintenant, côté{" "}
					<br />
					dentaire ?
				</>
			}
			canProceed={selected !== null}
			onNext={next}
		>
			{OPTIONS.map((opt) => (
				<Button
					key={opt.value}
					variant="selectOption"
					size="select"
					selected={selected === opt.value}
					onClick={() => updateFormData({ dents: opt.value as DentsValue })}
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
				title="On vous répond comme vous préférez."
				subtitle="Un conseiller reprend votre demande et vous contacte dans le canal choisi pour vous guider."
				icon={<InfoIcon className="size-5 text-[#9000E3]" />}
				className="mt-2"
			/>
		</StepScreen>
	);
}
