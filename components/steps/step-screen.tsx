"use client";

import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StepScreenProps {
	/** Section title (e.g. "Faisons connaissance") */
	title: string;
	/** Subtitle / question for this step */
	subtitle: string;
	/** Whether the "Suivant" button should be enabled */
	canProceed: boolean;
	/** Called when the user clicks "Suivant" */
	onNext: () => void;
	/** Selection content */
	children: ReactNode;
}

/**
 * Shared layout for every step screen:
 * title → subtitle → selection options → "Suivant" button (right-aligned)
 *
 * Positioned to the left of the content area with offset from the sidebar.
 */
export function StepScreen({
	title,
	subtitle,
	canProceed,
	onNext,
	children,
}: StepScreenProps) {
	return (
		<div className="flex flex-col gap-8 pl-4 pt-10">
			{/* Heading block */}
			<div className="flex flex-col gap-1">
				<h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#1D1B20]">
					{title}
				</h1>
				<p className="text-lg text-[#444444]">{subtitle}</p>
			</div>

			{/* Selection options — inline, sized to content */}
			<div className="flex flex-col items-start gap-3">{children}</div>

			{/* Suivant button — right-aligned under the section */}
			<div className="flex justify-end">
				<Button
					variant="ctaPurple"
					size="cta"
					disabled={!canProceed}
					onClick={onNext}
				>
					Suivant
					<ArrowRight className="size-5" />
				</Button>
			</div>
		</div>
	);
}
