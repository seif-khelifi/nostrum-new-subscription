"use client";

import { useCallback, useState } from "react";
import { X } from "lucide-react";
import { capitalize } from "@/lib/utils";
import { type OfferPlan, ALL_PLANS, RECOMMENDED_OFFER } from "@/lib/plans";
import type { StepId } from "@/config";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert";
import {
	ComparateurCompareCard,
	ComparateurInfoCard,
	OfferSelectionTabs,
	SectionCarousel,
	SectionDots,
	type CompareValues,
	type SectionMeta,
} from "@/components/ui/comparateur-a-cards";
import type { CarouselApi } from "@/components/ui/carousel";
import offersData from "@/data/offers.json";
import comparateurData from "@/data/comparateur-variant-a.json";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const sections: SectionMeta[] = comparateurData.sections as SectionMeta[];
const compareData = comparateurData.compareData as Record<string, Record<string, CompareValues>>;
const infoCardData = comparateurData.infoCard as Record<string, CompareValues>;

/* ------------------------------------------------------------------ */
/*  ComparateurVariantA                                                */
/* ------------------------------------------------------------------ */

export function ComparateurVariantA() {
	const { goToStepById } = useStepper();

	const { value: selectedOfferIndex, isReady } = useSessionStorage<number | null>(
		"selectedOffer",
		null,
	);
	const { value: comparateurOrigin } = useSessionStorage<StepId>(
		"comparateurOrigin",
		"garanties",
	);

	// Plans available in the tab selector (everything except the recommended offer)
	const otherPlans = ALL_PLANS.filter((p) => p !== RECOMMENDED_OFFER);

	const [comparedOffer, setComparedOffer] = useState<OfferPlan>(otherPlans[0]);
	const [initialized, setInitialized] = useState(false);

	// Once session storage is ready, derive the initial compared offer:
	// - From garanties (selectedOfferIndex set): use the user's selected plan,
	//   unless it matches the recommended offer → fall back to first other plan.
	// - From devis (selectedOfferIndex null): always default to first other plan.
	if (isReady && !initialized) {
		const userPlan =
			selectedOfferIndex !== null
				? (offersData.offers[selectedOfferIndex]?.plan as OfferPlan | undefined)
				: null;

		const initial =
			userPlan && userPlan !== RECOMMENDED_OFFER && otherPlans.includes(userPlan)
				? userPlan
				: otherPlans[0];

		setComparedOffer(initial);
		setInitialized(true);
	}

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
	const close = () => goToStepById(comparateurOrigin);
	const savingsAmount = comparateurData.banner.savingsAmount;

	// Resolve data for current section
	const recommendedData = compareData[RECOMMENDED_OFFER]?.[sectionKey] ?? { rembourse: 0, resteACharge: 0 };
	const comparedData = compareData[comparedOffer]?.[sectionKey] ?? { rembourse: 0, resteACharge: 0 };
	const infoData = infoCardData[RECOMMENDED_OFFER] ?? { rembourse: 0, resteACharge: 0 };

	// Shared banner content
	const bannerTitle = (
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
	);

	// Slider section helper
	const sliderSection = (withArrows = false) => (
		<>
			<SectionCarousel
				sections={sections}
				activeIndex={activeSection}
				onIndexChange={handleCarouselSelect}
				setApi={setCarouselApi}
				showArrows={withArrows}
			/>
			<SectionDots
				activeIndex={activeSection}
				total={sections.length}
				onDotClick={handleDotClick}
			/>
		</>
	);

	// Shared close button
	const closeButton = (
		<Button variant="closeComparateur" onClick={close}>
			Fermer le comparateur d{"'"}offres
			<span className="flex h-[26px] w-[42px] items-center justify-center rounded-full bg-[#360057] transition-colors hover:bg-[#4a0076]">
				<X className="h-4 w-4 text-[#F3E5FA]" />
			</span>
		</Button>
	);

	return (
		<div className="fixed inset-0 z-50 overflow-hidden bg-[#25003C]">
			{/* ─── Mobile (<lg) ─── */}
			<div className="lg:hidden flex flex-col h-full overflow-y-auto overflow-x-hidden">
				<div className="flex justify-center pt-10 pb-3 bg-[#25003C] shrink-0">
					{closeButton}
				</div>

				{/* Scrollable cards area */}
				<div className="flex-1 bg-[#25003C] px-4 pb-12 flex flex-col gap-3">
					<AlertBanner
						variant="comparateurDark"
						size="default"
						className="px-5 py-4 lg:px-6 lg:py-5"
						title={bannerTitle}
						imageSrc="/garanties/illustration=Alert14.svg"
						imageAlt="Comparateur info"
					/>
					<ComparateurInfoCard
						rembourse={infoData.rembourse}
						resteACharge={infoData.resteACharge}
					/>
					<ComparateurCompareCard
						plan={RECOMMENDED_OFFER}
						rembourse={recommendedData.rembourse}
						resteACharge={recommendedData.resteACharge}
						isRecommended
						isSelected
					/>
					<ComparateurCompareCard
						plan={comparedOffer}
						rembourse={comparedData.rembourse}
						resteACharge={comparedData.resteACharge}
					/>
				</div>

				{/* Bottom purple section */}
				<div className="bottom-0 z-10 shrink-0">
					<div className="px-4 -mb-4 relative z-10">
						<OfferSelectionTabs
							comparedOffer={comparedOffer}
							onComparedOfferChange={setComparedOffer}
						/>
					</div>
					<div className="bg-[#490076] px-4 pt-8 pb-8 overflow-hidden">
						<div className="mt-2">{sliderSection()}</div>
					</div>
				</div>
			</div>

			{/* ─── Desktop (lg+) ─── */}
			<div className="hidden lg:flex flex-col h-screen">
				{/* Top: close */}
				<div className="flex justify-center pt-8 pb-2 bg-[#25003C] shrink-0">
					{closeButton}
				</div>

				{/* Middle: cards area */}
				<div className="flex-1 bg-[#25003C] px-8 flex items-center justify-center min-h-0">
					<div className="w-full max-w-5xl grid grid-cols-2 gap-x-6 gap-y-3">
						<AlertBanner
							variant="comparateurDark"
							size="default"
							className="px-5 py-4 lg:px-6 lg:py-5"
							title={bannerTitle}
							imageSrc="/garanties/illustration=Alert14.svg"
							imageAlt="Comparateur info"
						/>
						<ComparateurCompareCard
							plan={RECOMMENDED_OFFER}
							rembourse={recommendedData.rembourse}
							resteACharge={recommendedData.resteACharge}
							isRecommended
							isSelected
						/>
						<ComparateurInfoCard
							rembourse={infoData.rembourse}
							resteACharge={infoData.resteACharge}
						/>
						<ComparateurCompareCard
							plan={comparedOffer}
							rembourse={comparedData.rembourse}
							resteACharge={comparedData.resteACharge}
						/>
					</div>
				</div>

				{/* Bottom: pinned purple section */}
				<div className="shrink-0">
					<div className="max-w-5xl mx-auto px-8 -mb-5 relative z-10">
						<OfferSelectionTabs
							comparedOffer={comparedOffer}
							onComparedOfferChange={setComparedOffer}
						/>
					</div>
					<div className="bg-[#490076] px-8 pt-10 pb-10">
						<div className="max-w-5xl mx-auto">
							<div className="mt-2">{sliderSection(true)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
