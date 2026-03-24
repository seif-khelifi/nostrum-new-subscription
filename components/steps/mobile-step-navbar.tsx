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
						<Button
							key={pill.groupId}
							variant="mobileStepPill"
							selected={pill.groupId === sidebarGroupId}
							onClick={() => goToGroup(pill.groupId)}
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
						</Button>
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
					{/* Advisor pill illustration */}
					<Image
						src="/navbarMobile/pill.svg"
						alt="Conseillers"
						width={80}
						height={40}
						className="mobile-step-navbar__pill-illustration"
						unoptimized
					/>

					{/* Phone call button (pill-shaped, overlaps illustration) */}
					<Button
						variant="mobileCallPill"
						asChild
						className="mobile-step-navbar__call"
					>
						<a
							href="tel:+33000000000"
							aria-label="Appeler un conseiller"
						>
							<Phone size={16} />
						</a>
					</Button>
				</div>
			</div>
		</header>
	);
}
