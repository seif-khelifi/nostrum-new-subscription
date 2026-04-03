"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type OfferPlan, ALL_PLANS, RECOMMENDED_OFFER, capitalize } from "./data";

/**
 * Offer selection tabs for Comparateur Variant A.
 *
 * Reuses the shared Tabs component with the `essential` variant shape
 * (rounded-full pill) but overrides colors to match the comparateur's
 * purple palette.
 */
export function OfferSelectionTabs({
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
							/* Override essential variant colors for dark-on-purple context */
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
