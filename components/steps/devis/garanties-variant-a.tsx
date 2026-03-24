"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { OfferCard, CompareCard } from "@/components/ui/offer-card";
import type { OfferPlan } from "@/components/ui/offer-card";
import { PlanLogo } from "@/components/ui/plan-logo";
import { AlertBanner } from "@/components/ui/alert";
import { GarantieCard, type GarantieCardColorScheme } from "@/components/ui/garantie-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import offersData from "@/data/offers.json";
import garantiesData from "@/data/garanties-variant-a.json";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PLAN_INDEX: Record<string, number> = {
	decouverte: 0,
	bronze: 1,
	silver: 2,
	gold: 3,
};

const OFFER_BG_COLORS: Record<string, string> = garantiesData.offerColors;

type AccordionSection = {
	value: string;
	title: string;
	description: string;
	colorScheme: string;
	cards: { title: string; description: string }[];
	detailCard?: {
		highlightText: string;
		ctaLabel: string;
		infoTitle: string;
		infoText: string;
		rightCard: { title: string; description: string };
	};
	ctaLabel?: string;
};

/* ------------------------------------------------------------------ */
/*  GarantiesVariantA                                                  */
/* ------------------------------------------------------------------ */

export function GarantiesVariantA() {
	const { goToStepById } = useStepper();
	const { value: selectedOfferIndex } = useSessionStorage<number | null>("selectedOffer", null);
	const { value: moreOfferIndex } = useSessionStorage<number | null>("moreOffer", null);

	// Determine which offer to show: "moreOffer" (from en savoir plus) or "selectedOffer"
	const offerIndex = moreOfferIndex ?? selectedOfferIndex ?? 2; // default to silver
	const offer = offersData.offers[offerIndex];
	const planName = offer?.plan ?? "silver";
	const bgColor = OFFER_BG_COLORS[planName] ?? "#F4F3FA";
	const compare = offersData.compareCard;
	const common = garantiesData.common;

	// Get offer-specific accordion sections
	const accordionData = garantiesData.accordion as Record<string, AccordionSection[]>;
	const sections: AccordionSection[] = accordionData[planName] ?? accordionData.silver;

	const { setValue: setSelectedOffer } = useSessionStorage<number | null>("selectedOffer", null);

	const handleChooseOffer = () => {
		setSelectedOffer(PLAN_INDEX[planName] ?? 0);
		goToStepById("sexe");
	};

	return (
		<>
			{/* ─── Mobile layout (<lg) ─── */}
			<div className="flex flex-col lg:hidden">
				{/* ── Variant indicator ── */}
				<h1 className="py-6 text-center text-5xl font-black text-[#9000E3]">VARIANT A</h1>

				{/* ── Colored hero section ── */}
				<div className="-mx-4 px-4 pt-6 pb-8 sm:-mx-6 sm:px-6" style={{ backgroundColor: bgColor }}>
					{/* Title */}
					<h3 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold leading-tight text-[#290E67]">
						{common.title}
					</h3>

					{/* Subtitle */}
					<p className="mt-2 text-base font-semibold text-[#1D1B20]">
						{common.subtitleTemplate.replace("{offer}", capitalize(planName))}
					</p>

					{/* Offer summary card — reuses OfferCard with hideCta */}
					<div className="mt-6">
						<OfferCard
							plan={planName as OfferPlan}
							tone="default"
							size="default"
							price={offer?.price ?? ""}
							period={offer?.period}
							descriptionTitle={offer?.descriptionTitle ?? ""}
							description={offer?.description ?? ""}
							hideCta
							logo={<PlanLogo plan={planName} />}
						/>
					</div>

					{/* "Voir le tableau de garanties" link — uses linkChevron variant */}
					<div className="mt-4 flex items-center justify-center">
						<Button variant="linkChevron" type="button">
							{common.seeGuaranteesLabel}
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* ── Content outside colored section ── */}

				{/* Single illustration */}
				<div className="px-2 pt-8">
					<div className="overflow-hidden rounded-2xl">
						<Image
							src="/garanties/single.svg"
							alt="Garanties illustration"
							width={600}
							height={400}
							className="h-auto w-full"
							priority
						/>
					</div>
				</div>

				{/* ── Accordion ── */}
				<div className="pt-8">
					<Accordion type="multiple" className="w-full" defaultValue={[sections[0]?.value]}>
						{sections.map((section, sectionIdx) => (
							<AccordionItem key={section.value} value={section.value} className="border-b-0">
								<AccordionTrigger className="py-4 hover:no-underline">
									{/* Normal font (Inter), text-2xl, bold */}
									<span className="text-2xl font-bold text-[#490076]">{section.title}</span>
								</AccordionTrigger>
								<AccordionContent className="pb-6">
									{/* Description */}
									<p className="mb-6 text-sm leading-relaxed text-[#490076]">
										{section.description}
									</p>

									{/* Section 1: 2 cards + full-width split card + button + info */}
									{sectionIdx === 0 && section.detailCard ? (
										<>
											{/* 2 top cards */}
											<div className="grid grid-cols-2 gap-3">
												{section.cards.slice(0, 2).map((card) => (
													<GarantieCard
														key={card.title}
														colorScheme={section.colorScheme as GarantieCardColorScheme}
														title={card.title}
														description={card.description}
													/>
												))}
											</div>

											{/* Full-width split card: left = white card, right = icon card */}
											<div
												className="mt-3 grid grid-cols-2 gap-3 overflow-hidden rounded-2xl p-4"
												style={{
													backgroundColor:
														section.colorScheme === "purple"
															? "#F3E5FA"
															: section.colorScheme === "warm"
																? "#FBF4EA"
																: "#E8F3F8",
												}}
											>
												{/* Left: white inner card */}
												<div className="rounded-2xl bg-white p-4">
													<p
														className="text-sm leading-relaxed text-[#490076]"
														dangerouslySetInnerHTML={{
															__html: section.detailCard.highlightText,
														}}
													/>
												</div>

												{/* Right: icon card */}
												<GarantieCard
													colorScheme="transparent"
													title={section.detailCard.rightCard.title}
													description={section.detailCard.rightCard.description}
												/>
											</div>

											{/* Button — extracted outside the card, with generous padding */}
											<div className="mt-4">
												<Button
													variant="ctaPurple"
													className="w-full rounded-[24px] h-12 px-6 text-sm font-semibold"
													onClick={() => {}}
												>
													{section.detailCard.ctaLabel}
													<ArrowRight className="ml-2 h-4 w-4" />
												</Button>
											</div>

											{/* Info banner — reuses AlertBanner with imageSrc variant */}
											<div className="mt-3">
												<AlertBanner
													variant="info"
													size="sm"
													title={section.detailCard.infoTitle}
													subtitle={section.detailCard.infoText}
													imageSrc="/garanties/illustration=Alert14.svg"
													imageAlt="Info illustration"
												/>
											</div>
										</>
									) : (
										/* Sections 2 & 3: grid of cards */
										<>
											<div className="grid grid-cols-2 gap-3">
												{section.cards.map((card) => (
													<GarantieCard
														key={card.title}
														colorScheme={section.colorScheme as GarantieCardColorScheme}
														title={card.title}
														description={card.description}
													/>
												))}
											</div>

											{/* CTA button for section 2, with generous padding */}
											{section.ctaLabel && (
												<div className="mt-4 flex justify-center">
													<Button
														variant="ctaPurple"
														className="rounded-[24px] h-12 px-6 text-sm font-semibold"
														onClick={() => {}}
													>
														{section.ctaLabel}
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											)}
										</>
									)}
								</AccordionContent>

								{/* Multi illustration — between section 2 and section 3 */}
								{sectionIdx === 1 && (
									<div className="px-2 py-4">
										<div className="overflow-hidden rounded-2xl">
											<Image
												src="/garanties/multi.svg"
												alt="Multi garanties illustration"
												width={600}
												height={400}
												className="h-auto w-full"
												loading="lazy"
											/>
										</div>
									</div>
								)}
							</AccordionItem>
						))}
					</Accordion>
				</div>

				{/* ── Compare card — reuses CompareCard from devis ── */}
				<div className="pb-4 pt-6">
					<CompareCard
						title={compare.title}
						description={compare.description}
						ctaLabel={compare.ctaLabel}
						onCtaClick={() => {}}
					/>
				</div>

				{/* ── Bottom CTA — #9000E3 bg, ctaPurple variant with override ── */}
				<div className="pb-8 pt-4">
					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] h-[52px] px-6 text-sm font-semibold bg-[#9000E3] hover:bg-[#7B00C4]"
						onClick={handleChooseOffer}
					>
						{common.ctaTemplate.replace("{offer}", capitalize(planName))}
						<ArrowRight className="ml-2 h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* ─── Desktop placeholder (lg+) ─── */}
			<div className="hidden items-center justify-center py-16 lg:flex flex-col gap-4">
				<h1 className="text-5xl font-black text-[#9000E3]">VARIANT A</h1>
				<p className="text-lg text-[#444444]">
					Version desktop à venir — veuillez utiliser la version mobile.
				</p>
			</div>
		</>
	);
}
