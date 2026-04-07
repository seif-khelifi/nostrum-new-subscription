"use client"

import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useStepper } from "@/context/StepperContext"
import { useVariant } from "@/context/VariantContext"

export interface StepNavbarVariantAProps {
	className?: string
}

/**
 * Variant A desktop navbar — back button + step title.
 *
 * When the current step has `navbarTitle` set in its text config,
 * the step's own `title` is displayed as an h1 in the navbar
 * (and the step hides its inner heading on desktop to avoid duplication).
 *
 * No progress bar, no CTA — those live in the right sidebar instead.
 *
 * When variant A is removed, delete this file.
 */
export function StepNavbarVariantA({ className }: StepNavbarVariantAProps) {
	const { isFirstStep, back, currentStepDef } = useStepper()
	const { texts } = useVariant()

	const stepTexts = texts[currentStepDef.id]
	/* Only show a title when the step opts in via navbarTitle */
	const showTitle = !!stepTexts?.navbarTitle
	const title = stepTexts?.title

	return (
		<header
			className={cn(
				"flex items-center gap-4 bg-transparent px-12 pt-6 pb-3 h-auto",
				className,
			)}
		>
			{/* Back button */}
			<Button
				variant="ghostCircle"
				aria-label="Retour"
				disabled={isFirstStep}
				onClick={back}
				className="h-10 w-12 disabled:opacity-40 disabled:pointer-events-none"
			>
				<ArrowLeft className="h-4 w-4 text-white" />
			</Button>

			{/* Step title — same font & size as the inner h1 */}
			{showTitle && title && (
				<h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#1D1B20]">
					{title}
				</h1>
			)}
		</header>
	)
}
