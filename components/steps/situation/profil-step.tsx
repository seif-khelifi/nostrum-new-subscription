"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";

const OPTIONS = [
	{ value: "salarie", label: "Salarié(e)" },
	{ value: "independant", label: "Indépendant(e)" },
	{ value: "fonctionnaire", label: "Fonctionnaire" },
	{ value: "etudiant", label: "Étudiant(e)" },
	{ value: "retraite", label: "Retraité(e)" },
	{ value: "sans_emploi", label: "Sans emploi" },
] as const;

export function ProfilStep() {
	const { next } = useStepper();
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<StepScreen
			title="Faisons connaissance"
			subtitle="Quel est votre profil ?"
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
						<span className="flex size-6 items-center justify-center rounded-full bg-[#490076] text-white">
							<Check className="size-3.5" />
						</span>
					)}
				</Button>
			))}
		</StepScreen>
	);
}
