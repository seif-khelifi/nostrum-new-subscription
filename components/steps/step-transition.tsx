"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Per-step enter-animation wrapper.
 *
 * Keyed on the current step id so React remounts this node on every
 * step change, which restarts the CSS animation. No exit animation:
 * the old tree disappears synchronously (StepRouter swaps component
 * types imperatively), and this enter is enough to mask the swap.
 *
 * The wrapper plays a different animation when navigating inside a
 * sub-flow to give overlayed flows (proteger sub-flow, comparateur,
 * résilier sub-flow…) a slightly heavier entrance that reads as
 * "we pushed you into a side-quest".
 *
 * Steps that render fixed-inset overlays themselves (onboarding hero,
 * transition-offer, comparateur welcome) opt out via `disabled`
 * so their internal entrance choreography stays authoritative.
 */
export interface StepTransitionProps {
	/** The step id — used as the React key to restart animations. */
	stepKey: string;
	/** Whether the step is being rendered as part of a sub-flow. */
	subFlow?: boolean;
	/** Skip the wrapper's own enter animation (e.g. for full-bleed overlays). */
	disabled?: boolean;
	children: ReactNode;
}

export function StepTransition({
	stepKey,
	subFlow,
	disabled,
	children,
}: StepTransitionProps) {
	if (disabled) {
		return <>{children}</>;
	}

	return (
		<div
			key={stepKey}
			data-slot="step-transition"
			data-sub-flow={subFlow ? "" : undefined}
			className={cn(
				"will-change-[opacity,transform]",
				subFlow ? "animate-overlay-in" : "animate-fade-up",
			)}
			style={{ animationDuration: subFlow ? "360ms" : "320ms" }}
		>
			{children}
		</div>
	);
}
