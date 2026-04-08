"use client"

import { ArrowLeft, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useStepper } from "@/context/StepperContext"


export interface StepNavbarVariantBProps {
	className?: string
}

/**
 * Variant B desktop navbar — back button + progress bar + CTA.
 *
 * Reads progress from StepperContext automatically.
 * Shows the full progress bar and "Parler à un conseiller" CTA pill.
 *
 * When variant B is removed, delete this file.
 */
export function StepNavbarVariantB({ className }: StepNavbarVariantBProps) {
	const { activeStep, allSteps, isFirstStep, back } = useStepper()

	/** Progress percentage based on completed steps (0–100) */
	const progress =
		allSteps.length > 1
			? Math.round((activeStep / (allSteps.length - 1)) * 100)
			: 0

	return (
		<header
			className={cn(
				"flex items-center gap-6 bg-background px-12 pt-6 pb-3 h-auto",
				className,
			)}
		>
			{/* Back button */}
			<Button
				variant="ghostCircle"
				aria-label="Retour"
				disabled={isFirstStep}
				onClick={back}
				className="h-10 w-12 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
			>
				<ArrowLeft className="h-4 w-4 text-[#1D1B20]" />
			</Button>

			{/* Progress bar */}
			<div className="min-w-0 flex-1 px-4">
				<Progress value={progress} />
			</div>

			{/* CTA: "Parler à un conseiller" */}
			<Button variant="callToAdvisor" size="none" asChild>
				<a href="tel:+33000000000">
					<span>Parler à un conseiller</span>
					<span className="inline-flex h-8 items-center justify-center rounded-full bg-[#CE99FF] px-3">
						<Phone className="size-3.5 text-white" />
					</span>
				</a>
			</Button>
		</header>
	)
}
