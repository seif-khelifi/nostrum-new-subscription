"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import offersData from "@/data/offers.json";
import {
	type OfferPlan,
	ALL_PLANS,
	RECOMMENDED_OFFER,
	sections,
	CloseButton,
	ComparateurBanner,
	ComparateurCompareCard,
	InfoDisplayCard,
	OfferSelectionTabs,
	SectionDots,
	CarouselDotSync,
} from "./comparateur-a";
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
					<CloseButton onClick={close} />
				</div>

				{/* Scrollable cards area */}
				<div className="flex-1 bg-[#25003C] px-4 pb-12 flex flex-col gap-3">
					<ComparateurBanner
						selectedOffer={RECOMMENDED_OFFER}
						comparedOffer={comparedOffer}
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
					<CloseButton onClick={close} />
				</div>

				{/* Middle: cards area — grows to fill, centers content */}
				<div className="flex-1 bg-[#25003C] px-8 flex items-center justify-center min-h-0">
					<div className="w-full max-w-5xl grid grid-cols-2 gap-x-6 gap-y-3">
						{/* Row 1 left: banner */}
						<ComparateurBanner
							selectedOffer={RECOMMENDED_OFFER}
							comparedOffer={comparedOffer}
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


