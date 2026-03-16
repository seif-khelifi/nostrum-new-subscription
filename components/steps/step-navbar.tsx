"use client"

import { ArrowLeft, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { useStepper } from "@/context/StepperContext"

export interface StepNavbarProps {
	className?: string
}

/**
 * Desktop step-flow navbar with back navigation, progress bar, and CTA.
 *
 * Reads progress from StepperContext automatically.
 * Placed in `components/steps/` because it's tightly coupled to the
 * step flow (back navigation + progress calculation from stepper state).
 */
export function StepNavbar({ className }: StepNavbarProps) {
	const { activeStep, allSteps, isFirstStep, back } = useStepper()

	/** Progress percentage based on completed steps (0–100) */
	const progress =
		allSteps.length > 1
			? Math.round((activeStep / (allSteps.length - 1)) * 100)
			: 0

	return (
		<header
			className={cn(
				"flex items-center gap-4 bg-background px-12 pt-6 pb-3 h-auto",
				className,
			)}
		>
			{/* Back button — slightly oval, bigger */}
			<button
				type="button"
				aria-label="Retour"
				disabled={isFirstStep}
				onClick={back}
				className={cn(
					"inline-flex items-center justify-center rounded-full transition-colors",
					"h-10 w-12 bg-black/5 hover:bg-black/10",
					"disabled:opacity-40 disabled:pointer-events-none",
				)}
			>
				<ArrowLeft className="h-4 w-4 text-[#1D1B20]" />
			</button>

			{/* Progress bar — stretches to fill remaining space with padding for CTA */}
				<div className="flex-1 px-8">
				<Progress value={progress} />
			</div>

			{/* CTA: "Parler à un conseiller" */}
			<a
				href="tel:+33000000000"
				className={cn(
					"inline-flex items-center gap-2 rounded-full",
					"bg-[#490076] px-4 py-2.5",
					"text-sm font-medium text-white whitespace-nowrap",
					"transition-colors hover:bg-[#5a0a8f] active:translate-y-px",
				)}
			>
				<span>Parler à un conseiller</span>
				<span
					className={cn(
						"inline-flex h-8 w-8 items-center justify-center rounded-full",
						"bg-[#CE99FF]",
					)}
				>
					<Phone className="h-3.5 w-3.5" />
				</span>
			</a>
		</header>
	)
}
