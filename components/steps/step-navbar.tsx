"use client"

import { ArrowLeft, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
			<Button
				variant="ghostCircle"
				aria-label="Retour"
				disabled={isFirstStep}
				onClick={back}
				className="h-10 w-12 disabled:opacity-40 disabled:pointer-events-none"
			>
				<ArrowLeft className="h-4 w-4 text-[#1D1B20]" />
			</Button>

			{/* Progress bar — stretches to fill remaining space with padding for CTA */}
				<div className="flex-1 px-8">
				<Progress value={progress} />
			</div>

			{/* CTA: "Parler à un conseiller" */}
			<Button variant="callToAdvisor" asChild>
				<a href="tel:+33000000000">
					<span>Parler à un conseiller</span>
					<span
						className={cn(
							"inline-flex h-8 w-8 items-center justify-center rounded-full",
							"bg-[#CE99FF]",
						)}
					>
						<Phone className="h-3.5 w-3.5 text-[#490076]" />
					</span>
				</a>
			</Button>
		</header>
	)
}
