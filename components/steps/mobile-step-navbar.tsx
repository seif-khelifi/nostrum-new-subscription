"use client";

import Image from "next/image";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import "./mobile-step-navbar.css";

export interface MobileStepNavbarProps {
	className?: string;
}

/**
 * Step-pill items shown in the mobile navbar.
 * Mirrors the group definitions in StepperContext (STEP_GROUPS)
 * but uses illustrative SVG icons for the compact mobile display.
 */
const stepPills = [
	{ groupId: 2, label: "Situation", icon: "/navbarMobile/illustration=Info.svg" },
	{ groupId: 3, label: "Santé", icon: "/navbarMobile/illustration=Sante.svg" },
	{ groupId: 5, label: "Devis", icon: "/navbarMobile/illustration=Coin.svg" },
	{ groupId: 6, label: "Souscription", icon: "/navbarMobile/illustration=Ordonnance.svg" },
];

/**
 * Mobile step-flow navbar.
 *
 * Reads stepper state from StepperContext — behaves like
 * the desktop SidebarStepper but as a horizontal pill strip.
 *
 * Placed in `components/steps/` because it's tightly coupled
 * to the step flow (back navigation + group switching from
 * stepper state), mirroring `step-navbar.tsx` for desktop.
 */
export function MobileStepNavbar({ className }: MobileStepNavbarProps) {
	const { sidebarGroupId, goToGroup, isFirstStep, back } = useStepper();

	return (
		<header className={cn("mobile-step-navbar", className)}>
			{/* ── Top row: back button + step pills ─────────── */}
			<div className="mobile-step-navbar__top">
				<Button
					size="icon"
					variant="ghost"
					disabled={isFirstStep}
					aria-label="Retour"
					onClick={back}
					className="mobile-step-navbar__back hover:bg-white/20 hover:text-white active:bg-white/30"
				>
					<ArrowLeft size={18} />
				</Button>

				<div className="mobile-step-navbar__steps">
					{stepPills.map((pill) => (
						<button
							key={pill.groupId}
							type="button"
							onClick={() => goToGroup(pill.groupId)}
							className={cn(
								"mobile-step-navbar__step",
								pill.groupId === sidebarGroupId &&
									"mobile-step-navbar__step--active",
							)}
						>
							<span>{pill.label}</span>
							<Image
								src={pill.icon}
								alt=""
								width={16}
								height={16}
								className="h-4 w-4 shrink-0 object-contain"
								unoptimized
							/>
						</button>
					))}
				</div>
			</div>

			{/* ── CTA card: "Parler à un conseiller" ────────── */}
			<div className="mobile-step-navbar__cta">
				<div>
					<p className="mobile-step-navbar__cta-title">
						Parler à un conseiller
					</p>
					<p className="mobile-step-navbar__cta-sub">
						On vous rappelle dans la journée
					</p>
				</div>

				<div className="mobile-step-navbar__cta-right">
					{/* Advisor avatar group with gradient halo */}
					<div className="mobile-step-navbar__avatars">
						<img
							src="/images/advisor1.png"
							alt="Conseiller"
							className="mobile-step-navbar__avatar"
						/>
						<img
							src="/images/advisor2.png"
							alt="Conseiller"
							className="mobile-step-navbar__avatar"
						/>
					</div>

					{/* Phone call button (overlaps avatar group) */}
					<a
						href="tel:+33000000000"
						aria-label="Appeler un conseiller"
						className="mobile-step-navbar__call"
					>
						<Phone size={16} />
					</a>
				</div>
			</div>
		</header>
	);
}
