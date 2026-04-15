"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { capitalize } from "@/lib/utils";
import { type OfferPlan, ALL_PLANS, RECOMMENDED_OFFER, PLAN_INDEX } from "@/lib/plans";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { getPricing, priceForPlan, formatDisplayPrice } from "@/lib/pricing";
import type { VitaSessionStorage, PlanPrices } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { OfferSelectCard } from "@/components/ui/offer-select-card";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ChangeOfferDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChangeOfferDrawer({
	open,
	onOpenChange,
}: ChangeOfferDrawerProps) {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	/* ── Session storage ── */
	const { value: session, setValue: setSession } =
		useSessionStorage<VitaSessionStorage>("session", {
			beneficiaries: [],
			plans: null,
			selectedPlan: null,
		});
	const { value: selectedOfferIndex, setValue: setSelectedOffer } =
		useSessionStorage<number | null>("selectedOffer", null);

	/* Derive prices: prefer session (API-computed), fall back to local calc */
	const prices: PlanPrices = session.plans ?? getPricing(session.beneficiaries);

	/* ── Resolve current plan from session ── */
	const storedPlanIndex = selectedOfferIndex ?? session.selectedPlan;
	const storedPlan: OfferPlan =
		storedPlanIndex !== null
			? (ALL_PLANS[storedPlanIndex] ?? RECOMMENDED_OFFER)
			: RECOMMENDED_OFFER;

	const [selectedPlan, setSelectedPlan] = useState<OfferPlan>(storedPlan);

	useEffect(() => {
		setSelectedPlan(storedPlan);
	}, [storedPlan]);

	/* ── Confirm handler — persist to session storage ── */
	const handleConfirm = () => {
		const planIndex = PLAN_INDEX[selectedPlan] ?? 0;
		setSelectedOffer(planIndex);
		setSession({ ...session, selectedPlan: planIndex });
		onOpenChange(false);
	};

	/* ── Derived data ── */
	const recommended = RECOMMENDED_OFFER;
	const otherPlans = ALL_PLANS.filter((p) => p !== recommended);
	const displayPrice = (plan: OfferPlan) =>
		formatDisplayPrice(priceForPlan(prices, plan));

	return (
		<ResponsiveDrawer
			open={open}
			onOpenChange={onOpenChange}
			title="Changer d'offre"
			description="On regarde ensemble ce que cette offre changerait vraiment pour vous."
			footer={
				<Button
					variant="ctaPurple"
					className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold gap-2"
					onClick={handleConfirm}
				>
					Choisir l{"'"}offre {capitalize(selectedPlan)}
					<Check className="h-5 w-5" />
				</Button>
			}
		>
			<div className="px-5 py-4 overflow-y-auto">
				<div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-5 lg:min-h-[280px]">
					<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-[#9000E3]">
							Ma formule recommandée
						</p>
						<OfferSelectCard
							plan={recommended}
							price={displayPrice(recommended)}
							layout={isDesktop ? "featured" : "row"}
							selected={selectedPlan === recommended}
							onSelect={() => setSelectedPlan(recommended)}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
							Nos autres offres
						</p>
						{otherPlans.map((plan) => (
							<OfferSelectCard
								key={plan}
								plan={plan}
								price={displayPrice(plan)}
								layout="row"
								selected={selectedPlan === plan}
								onSelect={() => setSelectedPlan(plan)}
							/>
						))}
					</div>
				</div>
			</div>
		</ResponsiveDrawer>
	);
}
