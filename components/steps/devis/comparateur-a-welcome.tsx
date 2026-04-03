"use client";

import Image from "next/image";
import { useStepper } from "@/context/StepperContext";
import { Button } from "@/components/ui/button";
import { CloseButton } from "./comparateur-a";
import comparateurData from "@/data/comparateur-variant-a.json";

const WELCOME_BG =
	"radial-gradient(183.97% 101.35% at 50% 100%, #FBF4EA 0%, #FEA8CD 34.13%, #CE99FF 62.98%, #9000E3 80.77%, #490076 100%)";

/**
 * Welcome / onboarding screen for Comparateur Variant A.
 * Registered as a standalone step (`comparateur_welcome`) in the variant config.
 * Fills the viewport exactly — no scroll.
 */
export function ComparateurWelcome() {
	const { goToStepById, next } = useStepper();
	const close = () => goToStepById("garanties");
	const start = () => next();

	return (
		<div
			className="fixed inset-0 z-50 flex flex-col overflow-hidden"
			style={{ background: WELCOME_BG }}
		>
			{/* ── Mobile ── */}
			<div className="flex flex-col h-full lg:hidden">
				<div className="flex justify-center pt-10 pb-2 shrink-0">
					<CloseButton onClick={close} />
				</div>

				<div className="flex-1 flex items-center justify-center px-8 min-h-0">
					<Image
						src={comparateurData.welcome.logoSrc}
						alt="Logo produit"
						width={200}
						height={200}
						className="w-44 h-auto max-h-[40vh] object-contain"
					/>
				</div>

				<div className="shrink-0 px-6 pb-8">
					<h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold leading-tight text-white">
						{comparateurData.welcome.title}
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-white/80">
						{comparateurData.welcome.subtitle}
					</p>
					<Button
						variant="ctaPurpleSquared"
						className="mt-5 w-full"
						onClick={start}
					>
						{comparateurData.welcome.ctaLabel}
					</Button>
				</div>
			</div>

			{/* ── Desktop ── */}
			<div className="hidden lg:flex flex-col h-full">
				<div className="flex justify-center pt-12 pb-4 shrink-0">
					<CloseButton onClick={close} />
				</div>

				<div className="flex-1 flex items-center justify-center px-12 min-h-0">
					<div className="grid grid-cols-2 gap-16 max-w-5xl w-full">
						<div className="flex flex-col justify-center">
							<h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-white">
								{comparateurData.welcome.title}
							</h1>
							<p className="mt-4 text-base leading-relaxed text-white/80">
								{comparateurData.welcome.subtitle}
							</p>
							<Button
								variant="ctaPurpleSquared"
								className="mt-8 w-fit px-10"
								onClick={start}
							>
								{comparateurData.welcome.ctaLabel}
							</Button>
						</div>

						<div className="flex items-center justify-center">
							<Image
								src={comparateurData.welcome.logoSrc}
								alt="Logo produit"
								width={320}
								height={320}
								className="w-64 h-auto max-h-[50vh] object-contain"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
