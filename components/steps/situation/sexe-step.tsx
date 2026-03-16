"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";

const OPTIONS = [
	{ value: "homme", label: "Un homme" },
	{ value: "femme", label: "Une femme" },
	{ value: "autre", label: "Aucun des deux" },
] as const;

export function SexeStep() {
	const { next } = useStepper();
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<StepScreen
			title="Faisons connaissance"
			subtitle="Vous êtes ?"
			canProceed={selected !== null}
			onNext={next}
		>
			{OPTIONS.map((opt) => (
				<Button
					key={opt.value}
					variant="selectOption"
					size="select"
					selected={selected === opt.value}
					onClick={() => setSelected(opt.value)}
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
