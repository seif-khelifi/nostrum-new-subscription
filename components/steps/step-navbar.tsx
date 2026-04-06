"use client"

import { useVariant } from "@/context/VariantContext"
import { StepNavbarVariantA } from "./step-navbar-variant-a"
import { StepNavbarVariantB } from "./step-navbar-variant-b"

export interface StepNavbarProps {
	className?: string
}

/**
 * Desktop step-flow navbar — variant router.
 *
 * Picks the correct navbar implementation based on the active variant:
 * - Variant A: back button + group title (from navbarTitle config)
 * - Variant B: back button + progress bar + CTA
 *
 * When you stabilize on one variant, replace this with the winning
 * component directly and delete the other file.
 */
export function StepNavbar({ className }: StepNavbarProps) {
	const { id: variantId } = useVariant()

	return variantId === "a"
		? <StepNavbarVariantA className={className} />
		: <StepNavbarVariantB className={className} />
}
