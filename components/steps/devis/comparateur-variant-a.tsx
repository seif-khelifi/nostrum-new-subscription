"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	useCarousel,
	type CarouselApi,
} from "@/components/ui/carousel";
import offersData from "@/data/offers.json";
import comparateurData from "@/data/comparateur-variant-a.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OfferPlan = "decouverte" | "bronze" | "silver" | "gold";

type CompareValues = {
	rembourse: number;
	resteACharge: number;
};

type SectionMeta = {
	key: string;
	icon: string;
	title: string;
	subtitle: string;
	description: string;
};

/* ------------------------------------------------------------------ */
/*  Constants & Data                                                   */
/* ------------------------------------------------------------------ */

const ALL_PLANS: OfferPlan[] = ["decouverte", "bronze", "silver", "gold"];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const RECOMMENDED_OFFER: OfferPlan =
	(offersData.offers.find((o) => o.tone === "recommended")
		?.plan as OfferPlan) ?? "silver";

const sections: SectionMeta[] = comparateurData.sections as SectionMeta[];

const compareData = comparateurData.compareData as Record<
	string,
	Record<string, CompareValues>
>;

const infoCardData = comparateurData.infoCard as Record<
	string,
	CompareValues
>;

/* ------------------------------------------------------------------ */
/*  VerticalProgressBar                                                */
/* ------------------------------------------------------------------ */

function VerticalProgressBar({
	percentage,
	height = 56,
}: {
	percentage: number;
	height?: number;
}) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="text-[10px] font-bold text-[#CE99FF]">
				{Math.round(percentage)}%
			</span>
			<div
				className="relative w-2.5 rounded-full overflow-hidden bg-[#25013D]"
				style={{ height }}
			>
				<div
					className="absolute bottom-0 left-0 w-full rounded-full bg-[#CE99FF] transition-all duration-300"
					style={{ height: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  ComparateurCompareCard                                             */
/* ------------------------------------------------------------------ */

function ComparateurCompareCard({
	plan,
	sectionKey,
	isRecommended = false,
	isSelected = false,
}: {
	plan: OfferPlan;
	sectionKey: string;
	isRecommended?: boolean;
	isSelected?: boolean;
}) {
	const planData = compareData[plan]?.[sectionKey] ?? {
		rembourse: 0,
		resteACharge: 0,
	};
	const total = planData.rembourse + planData.resteACharge;
	const percentage = total > 0 ? (planData.rembourse / total) * 100 : 0;

	return (
		<div
			className={cn(
				"rounded-2xl px-5 py-4 w-full lg:px-6 lg:py-5",
				isRecommended ? "bg-[#490076]" : "bg-[#490076]/50",
			)}
		>
			{/* Title row */}
			<div className="flex items-baseline gap-2 mb-3">
				<p className="text-white font-bold text-lg leading-none lg:text-xl">
					{capitalize(plan)}
				</p>
				{isRecommended && (
					<span className="text-[11px] italic text-[#CE99FF]">
						Recommandé pour vous
					</span>
				)}
			</div>

			{/* Content row: image | texts | progress */}
			<div className="flex items-center gap-4">
				<div className="shrink-0">
					<Image
						src={
							isSelected
								? "/comparateur/comp-selected.svg"
								: "/comparateur/comp-not-selected.svg"
						}
						alt={isSelected ? "Sélectionné" : "Non sélectionné"}
						width={48}
						height={48}
						className="w-12 h-12"
					/>
				</div>

				<div className="flex-1 min-w-0 flex flex-col gap-1.5">
					<div className="flex items-baseline justify-between">
						<span className="text-sm font-bold text-white">
							Remboursé
						</span>
						<span className="text-base font-bold text-[#CE99FF]">
							{planData.rembourse}€
						</span>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="text-xs text-white/70">
							Reste à charge
						</span>
						<span className="text-xs text-white font-medium">
							{planData.resteACharge}€
						</span>
					</div>
				</div>

				<div className="shrink-0">
					<VerticalProgressBar percentage={percentage} height={64} />
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  InfoDisplayCard                                                     */
/* ------------------------------------------------------------------ */

function InfoDisplayCard({ plan }: { plan: OfferPlan }) {
	const data = infoCardData[plan] ?? { rembourse: 0, resteACharge: 0 };

	return (
		<div className="rounded-2xl border-2 border-[#490076] bg-[#25003C] px-5 py-4 w-full lg:px-6 lg:py-5 lg:flex lg:items-center">
			<div className="flex items-center gap-4 w-full">
				<div className="shrink-0">
					<Image
						src="/comparateur/folder.svg"
						alt="Dossier"
						width={44}
						height={44}
						className="w-11 h-11"
					/>
				</div>
				<div className="flex-1 min-w-0 flex flex-col gap-1.5">
					<div className="flex items-baseline justify-between">
						<span className="text-sm text-[#CE99FF]">
							Remboursé
						</span>
						<span className="text-base font-bold text-[#CE99FF]">
							{data.rembourse}€
						</span>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="text-xs text-[#CE99FF]">
							Reste à charge
						</span>
						<span className="text-sm font-bold text-white">
							{data.resteACharge}€
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  OfferSelectionTabs                                                 */
/* ------------------------------------------------------------------ */

function OfferSelectionTabs({
	comparedOffer,
	onComparedOfferChange,
}: {
	comparedOffer: OfferPlan;
	onComparedOfferChange: (plan: OfferPlan) => void;
}) {
	const otherOffers = ALL_PLANS.filter((p) => p !== RECOMMENDED_OFFER);

	return (
		<Tabs
			value={comparedOffer}
			onValueChange={(val) => onComparedOfferChange(val as OfferPlan)}
			className="w-full lg:max-w-2xl lg:mx-auto"
		>
			<TabsList
				variant="essential"
				className="bg-[#CE99FF] p-1 gap-1"
			>
				{otherOffers.map((plan) => (
					<TabsTrigger
						key={plan}
						value={plan}
						variant="essential"
						className={cn(
							"text-sm font-semibold lg:text-base lg:py-2.5",
							"text-[#F3E5FA] hover:bg-[#F3E5FA]/20",
							"data-active:bg-[#F3E5FA] data-active:text-[#490076]",
						)}
					>
						{capitalize(plan)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}

/* ------------------------------------------------------------------ */
/*  SectionDots                                                        */
/* ------------------------------------------------------------------ */

function SectionDots({
	activeIndex,
	total,
	onDotClick,
}: {
	activeIndex: number;
	total: number;
	onDotClick: (index: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-3 py-2">
			{Array.from({ length: total }).map((_, i) => (
				<button
					key={i}
					type="button"
					onClick={() => onDotClick(i)}
					className={cn(
						"transition-all duration-200",
						i === activeIndex
							? "w-5 h-5"
							: "w-2 h-2 rounded-full bg-[#CE99FF]/40 hover:bg-[#CE99FF]/60",
					)}
				>
					{i === activeIndex ? (
						<Image
							src="/comparateur/diamond.svg"
							alt="Section active"
							width={20}
							height={20}
						/>
					) : null}
				</button>
			))}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  CarouselDotSync                                                    */
/* ------------------------------------------------------------------ */

function CarouselDotSync({
	activeIndex,
	onIndexChange,
}: {
	activeIndex: number;
	onIndexChange: (index: number) => void;
}) {
	const { api } = useCarousel();

	useEffect(() => {
		if (!api) return;
		const onSelect = () => onIndexChange(api.selectedScrollSnap());
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onIndexChange]);

	useEffect(() => {
		if (!api) return;
		api.scrollTo(activeIndex);
	}, [api, activeIndex]);

	return null;
}

/* ================================================================== */
/*  COMPARATEUR CONTENT                                                */
/*                                                                     */
/*  DESKTOP (lg+):                                                     */
/*    Full viewport. Top area with close + 4 cards centered.           */
/*    Bottom section (#490076) pinned to bottom with tabs + slider.    */
/*                                                                     */
/*  MOBILE (<lg):                                                      */
/*    Vertical scroll. Cards stacked simply.                           */
/* ================================================================== */

export function ComparateurVariantA() {
	const { goToStepById } = useStepper();

	const { value: selectedOfferIndex } = useSessionStorage<number | null>(
		"selectedOffer",
		null,
	);

	const userSelectedPlan: OfferPlan =
		selectedOfferIndex !== null
			? ((offersData.offers[selectedOfferIndex]?.plan as OfferPlan) ??
				"bronze")
			: "bronze";

	const [comparedOffer, setComparedOffer] = useState<OfferPlan>(() => {
		if (userSelectedPlan !== RECOMMENDED_OFFER) return userSelectedPlan;
		const others = ALL_PLANS.filter((p) => p !== RECOMMENDED_OFFER);
		return others[0] ?? "bronze";
	});

	const [activeSection, setActiveSection] = useState(0);
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();

	const handleDotClick = useCallback(
		(index: number) => {
			setActiveSection(index);
			carouselApi?.scrollTo(index);
		},
		[carouselApi],
	);

	const handleCarouselSelect = useCallback((index: number) => {
		setActiveSection(index);
	}, []);

	const sectionKey = sections[activeSection]?.key ?? "dentaire";
	const close = () => goToStepById("garanties");
	const savingsAmount = comparateurData.banner.savingsAmount;

	/* Shared slider content */
	const renderSlider = () => (
		<>
			<Carousel
				opts={{ loop: false, align: "center" }}
				setApi={setCarouselApi}
			>
				<CarouselContent>
					{sections.map((section) => (
						<CarouselItem key={section.key}>
							<div className="flex flex-col items-center text-center px-6">
								<div className="flex items-center gap-2.5 mb-2">
									<Image
										src={section.icon}
										alt={section.title}
										width={24}
										height={24}
									/>
									<span className="text-[#E0B1FF] text-sm font-medium lg:text-base">
										{section.title}
									</span>
								</div>
								<p className="text-white font-bold text-base leading-snug lg:text-lg">
									{section.subtitle}
								</p>
								<p className="mt-1.5 text-[#E0B1FF] text-xs leading-relaxed max-w-md lg:text-sm">
									{section.description}
								</p>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselDotSync
					activeIndex={activeSection}
					onIndexChange={handleCarouselSelect}
				/>
			</Carousel>
			<SectionDots
				activeIndex={activeSection}
				total={sections.length}
				onDotClick={handleDotClick}
			/>
		</>
	);

	return (
		<div className="fixed inset-0 z-50 overflow-hidden bg-[#25003C]">
			{/* ─────────────────────────────────────────────────────── */}
			{/*  MOBILE  (<lg)                                         */}
			{/*  Cards scroll, bottom purple section is sticky.        */}
			{/*  Tab selector sits at the boundary of the two zones.   */}
			{/* ─────────────────────────────────────────────────────── */}
			<div className="lg:hidden flex flex-col h-full overflow-y-auto overflow-x-hidden">
				<div className="flex justify-center pt-10 pb-3 bg-[#25003C] shrink-0">
					<Button variant="closeComparateur" onClick={close}>
						Fermer le comparateur d{"'"}offres
						<span className="flex h-[26px] w-[42px] items-center justify-center rounded-full bg-[#360057] transition-colors hover:bg-[#4a0076]">
							<X className="h-4 w-4 text-[#F3E5FA]" />
						</span>
					</Button>
				</div>

				{/* Scrollable cards area */}
				<div className="flex-1 bg-[#25003C] px-4 pb-12 flex flex-col gap-3">
					<AlertBanner
						variant="comparateurDark"
						size="default"
						className="px-5 py-4 lg:px-6 lg:py-5"
						title={
							<span className="text-sm font-normal leading-relaxed text-white">
								Avec{" "}
								<span className="font-bold text-[#CE99FF]">
									{capitalize(RECOMMENDED_OFFER)}
								</span>
								, vous économisez{" "}
								<span className="font-bold text-[#CE99FF]">
									{savingsAmount}
								</span>{" "}
								de plus qu{"'"}avec {capitalize(comparedOffer)} sur une seule
								couronne
							</span>
						}
						imageSrc="/garanties/illustration=Alert14.svg"
						imageAlt="Comparateur info"
					/>
					<InfoDisplayCard plan={RECOMMENDED_OFFER} />
					<ComparateurCompareCard
						plan={RECOMMENDED_OFFER}
						sectionKey={sectionKey}
						isRecommended
						isSelected
					/>
					<ComparateurCompareCard
						plan={comparedOffer}
						sectionKey={sectionKey}
					/>
				</div>

				{/* Sticky bottom purple section */}
				<div className=" bottom-0 z-10 shrink-0">
					{/* Tab selector — half overlapping the boundary */}
					<div className="px-4 -mb-4 relative z-10">
						<OfferSelectionTabs
							comparedOffer={comparedOffer}
							onComparedOfferChange={setComparedOffer}
						/>
					</div>
					<div className="bg-[#490076] px-4 pt-8 pb-8 overflow-hidden">
						<div className="mt-2">{renderSlider()}</div>
					</div>
				</div>
			</div>

			{/* ─────────────────────────────────────────────────────── */}
			{/*  DESKTOP  (lg+)                                        */}
			{/*  Full viewport height.                                 */}
			{/*    - Top: close button                                 */}
			{/*    - Middle (flex-1): 4 cards centered (2×2 grid)      */}
			{/*    - Bottom: pinned purple section with tabs + slider  */}
			{/* ─────────────────────────────────────────────────────── */}
			<div className="hidden lg:flex flex-col h-screen">
				{/* Top: close */}
				<div className="flex justify-center pt-8 pb-2 bg-[#25003C] shrink-0">
					<Button variant="closeComparateur" onClick={close}>
						Fermer le comparateur d{"'"}offres
						<span className="flex h-[26px] w-[42px] items-center justify-center rounded-full bg-[#360057] transition-colors hover:bg-[#4a0076]">
							<X className="h-4 w-4 text-[#F3E5FA]" />
						</span>
					</Button>
				</div>

				{/* Middle: cards area — grows to fill, centers content */}
				<div className="flex-1 bg-[#25003C] px-8 flex items-center justify-center min-h-0">
					<div className="w-full max-w-5xl grid grid-cols-2 gap-x-6 gap-y-3">
						{/* Row 1 left: banner */}
						<AlertBanner
							variant="comparateurDark"
							size="default"
							className="px-5 py-4 lg:px-6 lg:py-5"
							title={
								<span className="text-sm font-normal leading-relaxed text-white">
									Avec{" "}
									<span className="font-bold text-[#CE99FF]">
										{capitalize(RECOMMENDED_OFFER)}
									</span>
									, vous économisez{" "}
									<span className="font-bold text-[#CE99FF]">
										{savingsAmount}
									</span>{" "}
									de plus qu{"'"}avec {capitalize(comparedOffer)} sur une seule
									couronne
								</span>
							}
							imageSrc="/garanties/illustration=Alert14.svg"
							imageAlt="Comparateur info"
						/>
						{/* Row 1 right: recommended card */}
						<ComparateurCompareCard
							plan={RECOMMENDED_OFFER}
							sectionKey={sectionKey}
							isRecommended
							isSelected
						/>
						{/* Row 2 left: info card */}
						<InfoDisplayCard plan={RECOMMENDED_OFFER} />
						{/* Row 2 right: compared card */}
						<ComparateurCompareCard
							plan={comparedOffer}
							sectionKey={sectionKey}
						/>
					</div>
				</div>

				{/* Bottom: pinned purple section */}
				<div className="shrink-0">
					{/* Tab selector — overlapping the boundary between dark and light purple */}
					<div className="max-w-5xl mx-auto px-8 -mb-5 relative z-10">
						<OfferSelectionTabs
							comparedOffer={comparedOffer}
							onComparedOfferChange={setComparedOffer}
						/>
					</div>
					<div className="bg-[#490076] px-8 pt-10 pb-10">
						<div className="max-w-5xl mx-auto">
							<div className="mt-2">{renderSlider()}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
