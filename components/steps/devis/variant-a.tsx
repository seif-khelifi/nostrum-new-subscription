"use client";

import { useStepper } from "@/context/StepperContext";
import {
	OfferCard,
	CompareCard,
	OfferCardMoreFooter,
	OfferCardHoverGroup,
} from "@/components/ui/offer-card";
import type { OfferPlan } from "@/components/ui/offer-card";
import { PlanLogo } from "@/components/ui/plan-logo";
import offersData from "@/data/offers.json";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Devis Variant A — offer comparison layout.
 *
 * Desktop (lg+) : 4-column grid, "En savoir plus" outside cards with hover ring.
 * Mobile  (<lg) : Edge-to-edge #F3E5FA section with title + subtitle + recommended card,
 *                  "Nos autres formules" heading, stacked cards with #F3E5FA footer,
 *                  and a CompareCard at the bottom.
 */
export function DevisVariantA() {
	const { next, goToStepById } = useStepper();

	const recommended = offersData.offers.find((o) => o.tone === "recommended");
	const others = offersData.offers.filter((o) => o.tone !== "recommended");
	const compare = offersData.compareCard;

	return (
		<div className="mx-auto w-full max-w-6xl lg:py-8 lg:px-6">
			{/* ─── Mobile layout ─── */}
			<div className="flex flex-col lg:hidden">
				{/* Hero section: edge-to-edge #F3E5FA bg (negate parent p-4) */}
				<div className="-mx-4 -mt-4 bg-[#F3E5FA] px-4 pt-6 pb-8">
					{/* Title — same size as other steps (text-4xl) */}
					<h1 className="text-4xl font-bold leading-tight text-[#290E67]">
						Votre formule mutuelle sur-mesure
					</h1>

					{/* Subtitle — matches StepScreen subtitle styling */}
					<div className="mt-2 flex items-center gap-2 text-base font-semibold text-[#1D1B20] sm:text-lg">
						<span>Pour vous et votre famille</span>
						<button
							type="button"
							onClick={() => goToStepById("proteger")}
							className="font-semibold text-[#9000E3] hover:underline"
						>
							Modifier
						</button>
					</div>

					{/* Recommended card */}
					{recommended && (
						<div className="mt-6">
							<OfferCard
								plan={recommended.plan as OfferPlan}
								tone="recommended"
								size="default"
								price={recommended.price}
								period={recommended.period}
								badgeTitle={recommended.badgeTitle ?? undefined}
								ctaLabel={`Je choisis la formule ${capitalize(recommended.plan)}`}
								descriptionTitle={recommended.descriptionTitle}
								description={recommended.description}
								moreLabel={`En savoir plus sur ma formule ${capitalize(recommended.plan)}`}
								onMoreClick={() => {}}
								onCtaClick={next}
								logo={<PlanLogo plan={recommended.plan} />}
							/>
						</div>
					)}
				</div>

				{/* "Nos autres formules" heading — same size as step titles */}
				<div className="pt-8">
					<h1 className="text-4xl font-bold leading-tight text-[#490076]">
						Nos autres formules
					</h1>
				</div>

				{/* Default cards — #F3E5FA footer with "En savoir plus" */}
				<div className="flex flex-col gap-5 pt-6">
					{others.map((offer) => (
						<OfferCardMoreFooter
							key={offer.plan}
							moreLabel="En savoir plus"
							onMoreClick={() => {}}
						>
							<OfferCard
								plan={offer.plan as OfferPlan}
								tone="default"
								size="default"
								price={offer.price}
								period={offer.period}
								ctaLabel={`Je choisis la formule ${capitalize(offer.plan)}`}
								descriptionTitle={offer.descriptionTitle}
								description={offer.description}
								onCtaClick={next}
								logo={<PlanLogo plan={offer.plan} />}
							/>
						</OfferCardMoreFooter>
					))}
				</div>

				{/* Compare card */}
				<div className="pt-8 pb-4">
					<CompareCard
						title={compare.title}
						description={compare.description}
						ctaLabel={compare.ctaLabel}
						onCtaClick={() => {}}
					/>
				</div>
			</div>

			{/* ─── Desktop layout ─── */}
			<div className="hidden lg:grid lg:grid-cols-4 lg:items-start lg:gap-5">
				{offersData.offers.map((offer) => (
					<OfferCardHoverGroup
						key={offer.plan}
						moreLabel="En savoir plus"
						onMoreClick={() => {}}
					>
						<OfferCard
							plan={offer.plan as OfferPlan}
							tone={offer.tone as "default" | "recommended"}
							size="default"
							price={offer.price}
							period={offer.period}
							badgeTitle={offer.badgeTitle ?? undefined}
							ctaLabel={offer.ctaLabel}
							descriptionTitle={offer.descriptionTitle}
							description={offer.description}
							onCtaClick={next}
							logo={<PlanLogo plan={offer.plan} />}
						/>
					</OfferCardHoverGroup>
				))}
			</div>

			{/* Desktop compare card — full width below the grid */}
			<div className="hidden lg:mt-8 lg:block">
				<CompareCard
					title={compare.title}
					description={compare.description}
					ctaLabel={compare.ctaLabel}
					onCtaClick={() => {}}
					className="mx-auto max-w-md"
				/>
			</div>
		</div>
	);
}
