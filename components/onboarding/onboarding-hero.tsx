"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OnboardingHeroProps {
	onStart?: () => void;
}

/**
 * Onboarding hero section — split layout for desktop.
 *
 * Left half: headline, subtitle, bullet points, CTA.
 * Right half: dark decorative card.
 */
export function OnboardingHero({ onStart }: OnboardingHeroProps) {
	return (
		<div className="flex h-full w-full gap-8 p-6 lg:p-10">
			{/* ── Left half ────────────────────────────────────── */}
			<div className="flex flex-1 items-center justify-center">
				<div className="flex max-w-lg flex-col items-center text-center">
					{/* Title — uses the global h1 font (Bricolage Grotesque) */}
					<h1 className="text-5xl lg:text-6xl leading-tight">
						La couverture{" "}
						<br />
						santé qui s&apos;adapte{" "}
						<br className="hidden lg:block" />
						vraiment à vous.
					</h1>

					{/* Subtitle */}
					<p className="mt-4 text-base lg:text-lg text-muted-foreground">
						Votre formule idéale en moins d&apos;1&nbsp;minute.
						<br />
						Tarif immédiat, sans engagement.
					</p>

					{/* Bullet points */}
					<ul className="mt-6 space-y-2 text-sm lg:text-base text-foreground">
						<li>• Couverture personnalisée</li>
						<li>• Remboursements bien-être</li>
						<li>• App simple et rapide</li>
					</ul>

					{/* CTA button */}
					<Button
						variant="ctaPurpleSquared"
						className="mt-8 gap-2"
						onClick={onStart}
					>
						<Star className="h-5 w-5" />
						C&apos;est parti
					</Button>

					{/* Sub-CTA reassurance */}
					<p className="mt-4 text-xs lg:text-sm text-muted-foreground">
						60&nbsp;secondes. Aucune obligation.
					</p>
				</div>
			</div>

			{/* ── Right half ───────────────────────────────────── */}
			<div className="hidden md:flex flex-1 items-stretch">
				<div className="w-full rounded-[3rem] bg-[#1A1A1A]" />
			</div>
		</div>
	);
}
