"use client";

import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StepScreenProps {
	/** Section title (e.g. "Votre situation pro ?") */
	title: ReactNode;
	/** Subtitle / question for this step (optional — can be text or a ReactNode with PillInput) */
	subtitle?: ReactNode;
	/** Optional info card (AlertBanner) displayed between heading and content */
	infoCard?: ReactNode;
	/** Whether the "Suivant" button should be enabled */
	canProceed: boolean;
	/** Called when the user clicks "Suivant" */
	onNext: () => void;
	/** Selection content */
	children: ReactNode;
	/** When true, the button will be type="submit" (for form wrappers) */
	isForm?: boolean;
	/** Optional custom action button that replaces the default "Suivant" button */
	customAction?: ReactNode;
}

/**
 * Shared layout for every step screen:
 * title → subtitle → info card → selection options → "Suivant" button (right-aligned)
 *
 * Positioned to the left of the content area with offset from the sidebar.
 */
export function StepScreen({
	title,
	subtitle,
	infoCard,
	canProceed,
	onNext,
	children,
	isForm,
	customAction,
}: StepScreenProps) {
	return (
		<div className="flex flex-col gap-5 sm:gap-8 px-2 sm:pl-12 sm:pr-0 pt-6 sm:pt-4">
			{/* Heading block */}
			<div className="flex flex-col gap-2">
				<h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#1D1B20]">
					{title}
				</h1>
				{subtitle && (
					<div className="font-semibold text-base sm:text-lg text-[#1D1B20]">
						{subtitle}
					</div>
				)}
			</div>

			{/* Info card */}
			{infoCard}

			{/* Selection options — inline, sized to content */}
			<div className="flex flex-col items-start gap-2 sm:gap-3">{children}</div>

			{/* Action button — right-aligned under the section */}
			<div className="flex justify-end">
				{customAction ?? (
					<Button
						type={isForm ? "submit" : "button"}
						variant="ctaPurple"
						size="cta"
						disabled={!canProceed}
						onClick={isForm ? undefined : onNext}
					>
						Suivant
						<ArrowRight className="size-5" />
					</Button>
				)}
			</div>
		</div>
	);
}
