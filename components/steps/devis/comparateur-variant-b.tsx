"use client";

import { ArrowLeft } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { Button } from "@/components/ui/button";

/**
 * Offre Comparateur — Variant B
 *
 * Placeholder page for comparing offers (variant B layout).
 * Navigated to from the "Comparer les formules" card on the garanties screen.
 */
export function ComparateurVariantB() {
	const { goToStepById } = useStepper();

	return (
		<div className="flex flex-col gap-6 py-6">
			{/* Back link */}
			<button
				type="button"
				onClick={() => goToStepById("garanties")}
				className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9000E3] hover:underline"
			>
				<ArrowLeft className="h-4 w-4" />
				Retour aux garanties
			</button>

			{/* Title */}
			<h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-[#290E67]">
				Comparateur d&apos;offres
			</h2>

			{/* Placeholder content */}
			<div className="flex flex-col items-center gap-4 rounded-2xl bg-[#F3E5FA] p-8 text-center">
				<p className="text-base font-semibold text-[#490076]">
					Le comparateur d&apos;offres arrive bientôt
				</p>
				<p className="max-w-md text-sm text-[#1D1B20]">
					Vous pourrez comparer toutes nos formules côte à côte pour trouver celle qui correspond le mieux à vos besoins.
				</p>
			</div>

			{/* CTA back */}
			<Button
				variant="revenirOffres"
				onClick={() => goToStepById("garanties")}
			>
				Retour aux garanties
			</Button>
		</div>
	);
}
