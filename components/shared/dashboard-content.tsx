"use client";

import { StepRouter } from "@/components/steps/step-router";

/**
 * Shared dashboard content rendered inside both DesktopShell and MobileShell.
 * Renders the current step screen from the stepper context.
 */
export function DashboardContent() {
	return <StepRouter />;
}
