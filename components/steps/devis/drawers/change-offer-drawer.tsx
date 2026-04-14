"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn, capitalize } from "@/lib/utils";
import { type OfferPlan, ALL_PLANS, RECOMMENDED_OFFER, PLAN_INDEX } from "@/lib/plans";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { getPricing, priceForPlan } from "@/lib/pricing";
import type { VitaSessionStorage, PlanPrices } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { PlanLogo } from "@/components/ui/plan-logo";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerFooter,
} from "@/components/ui/drawer";

/* ------------------------------------------------------------------ */
/*  Offer colours (per plan)                                           */
/* ------------------------------------------------------------------ */

const OFFER_COLORS: Record<string, string> = {
	decouverte: "#F3E5FA",
	bronze: "#FFF7E8",
	silver: "#F4F3FA",
	gold: "#FEFFF4",
};

/**
 * Ensure a price string is displayed as "XX,XX€".
 * Handles both already-formatted ("106,78€") and session-stored ("106.78") values.
 */
function formatDisplayPrice(raw: string): string {
	if (raw.includes("€")) return raw;
	// "106.78" → "106,78€"
	const num = parseFloat(raw);
	if (Number.isNaN(num)) return raw;
	return num.toFixed(2).replace(".", ",") + "€";
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ChangeOfferDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Custom radio indicator                                             */
/* ------------------------------------------------------------------ */

function OfferRadio({ selected }: { selected: boolean }) {
	return (
		<span
			className={cn(
				"relative flex shrink-0 items-center justify-center rounded-full transition-colors",
				"size-6 border-[2.5px]",
				selected
					? "border-[#9000E3] bg-[#F3E5FA]"
					: "border-[#D1C9C0] bg-white",
			)}
		>
			{selected && (
				<Check className="size-3.5 text-[#9000E3]" strokeWidth={3} />
			)}
		</span>
	);
}

/* ------------------------------------------------------------------ */
/*  Single offer row (mobile list + desktop "others" list)             */
/* ------------------------------------------------------------------ */

function OfferRow({
	plan,
	price,
	selected,
	onSelect,
}: {
	plan: OfferPlan;
	price: string;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex w-full items-center gap-3 rounded-2xl p-3 transition-all text-left",
				selected
					? "border-2 border-[#9000E3] bg-[#FAF4FB]"
					: "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
			)}
		>
			<PlanLogo plan={plan} className="h-7 w-auto shrink-0" width={56} height={28} />
			<div className="flex flex-1 flex-col gap-0.5 min-w-0">
				<span className="text-sm font-semibold text-[#290E67]">
					{capitalize(plan)}
				</span>
				<span className="text-base font-bold text-[#490076]">{price}</span>
			</div>
			<OfferRadio selected={selected} />
		</button>
	);
}

/* ------------------------------------------------------------------ */
/*  Desktop recommended card (left column)                             */
/* ------------------------------------------------------------------ */

function RecommendedCard({
	plan,
	price,
	selected,
	onSelect,
}: {
	plan: OfferPlan;
	price: string;
	selected: boolean;
	onSelect: () => void;
}) {
	const bgColor = OFFER_COLORS[plan] ?? "#F4F3FA";

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex h-full w-full flex-col rounded-2xl transition-all overflow-hidden",
				selected
					? "border-2 border-[#9000E3] shadow-[0_0_0_1px_#9000E3]"
					: "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
			)}
		>
			{/* Big plan logo with background */}
			<div
				className="flex items-center justify-center px-6 pt-6 pb-4"
				style={{ backgroundColor: bgColor }}
			>
				<PlanLogo plan={plan} className="h-16 w-auto" width={128} height={64} />
			</div>

			{/* Name + price + radio */}
			<div className="flex flex-1 items-center gap-3 px-4 py-4">
				<div className="flex flex-1 flex-col gap-0.5 min-w-0">
					<span className="text-sm font-semibold text-[#290E67]">
						{capitalize(plan)}
					</span>
					<span className="text-lg font-bold text-[#490076]">{price}</span>
				</div>
				<OfferRadio selected={selected} />
			</div>
		</button>
	);
}

/* ------------------------------------------------------------------ */
/*  Shared inner content                                               */
/* ------------------------------------------------------------------ */

function ChangeOfferContent({
	selectedPlan,
	onSelect,
	onConfirm,
	isDesktop,
	prices,
}: {
	selectedPlan: OfferPlan;
	onSelect: (plan: OfferPlan) => void;
	onConfirm: () => void;
	isDesktop: boolean;
	prices: PlanPrices;
}) {
	const recommended = RECOMMENDED_OFFER;
	const recommendedPrice = formatDisplayPrice(priceForPlan(prices, recommended));
	const otherPlans = ALL_PLANS.filter((p) => p !== recommended);

	if (isDesktop) {
		/* ── Desktop: split layout ── */
		return (
			<div className="flex flex-col gap-6">
				{/* Two-column grid */}
				<div className="grid grid-cols-[1fr_1.2fr] gap-5 min-h-[280px]">
					{/* Left: recommended offer as big card */}
					<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-[#9000E3]">
							Ma formule recommandée
						</p>
						<RecommendedCard
							plan={recommended}
							price={recommendedPrice}
							selected={selectedPlan === recommended}
							onSelect={() => onSelect(recommended)}
						/>
					</div>

					{/* Right: other offers */}
					<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
							Nos autres offres
						</p>
						<div className="flex flex-col gap-2">
							{otherPlans.map((plan) => (
								<OfferRow
									key={plan}
									plan={plan}
									price={formatDisplayPrice(priceForPlan(prices, plan))}
									selected={selectedPlan === plan}
									onSelect={() => onSelect(plan)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* CTA */}
				<Button
					variant="ctaPurple"
					className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold gap-2"
					onClick={onConfirm}
				>
					Choisir l{"'"}offre {capitalize(selectedPlan)}
					<Check className="h-5 w-5" />
				</Button>
			</div>
		);
	}

	/* ── Mobile: stacked layout ── */
	return (
		<div className="flex flex-col gap-4">
			{/* Recommended */}
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold uppercase tracking-wide text-[#9000E3]">
					Ma formule recommandée
				</p>
				<OfferRow
					plan={recommended}
					price={recommendedPrice}
					selected={selectedPlan === recommended}
					onSelect={() => onSelect(recommended)}
				/>
			</div>

			{/* Others */}
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
					Nos autres offres
				</p>
				{otherPlans.map((plan) => (
					<OfferRow
						key={plan}
						plan={plan}
						price={formatDisplayPrice(priceForPlan(prices, plan))}
						selected={selectedPlan === plan}
						onSelect={() => onSelect(plan)}
					/>
				))}
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
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

	/* ── Local UI state ──
	 * Default to the already-selected offer from session storage.
	 * selectedOffer (0-3) maps to ALL_PLANS[index].
	 * Fall back to session.selectedPlan, then to RECOMMENDED_OFFER.
	 */
	const storedPlanIndex = selectedOfferIndex ?? session.selectedPlan;
	const storedPlan: OfferPlan =
		storedPlanIndex !== null
			? (ALL_PLANS[storedPlanIndex] ?? RECOMMENDED_OFFER)
			: RECOMMENDED_OFFER;

	const [selectedPlan, setSelectedPlan] = useState<OfferPlan>(storedPlan);

	// Sync local state when session storage loads asynchronously
	useEffect(() => {
		setSelectedPlan(storedPlan);
	}, [storedPlan]);

	/* ── Confirm handler — persist to session storage ── */
	const handleConfirm = () => {
		const planIndex = PLAN_INDEX[selectedPlan] ?? 0;

		// Update the separate selectedOffer key
		setSelectedOffer(planIndex);

		// Update the main session with the new selected plan
		setSession({
			...session,
			selectedPlan: planIndex,
		});

		onOpenChange(false);
	};

	const headerImage = (
		<div className="px-5 pt-5">
			<Image
				src="/drawers/drawer-garanties-b.svg"
				alt="Changer d'offre"
				width={48}
				height={48}
				className="h-12 w-12"
			/>
		</div>
	);

	/* ── Desktop → Dialog ── */
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					showCloseButton
					className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0"
				>
					{headerImage}
					<div className="px-5 pt-4 pb-2 text-left">
						<DialogTitle className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#34266D]">
							Changer d{"'"}offre
						</DialogTitle>
						<p className="mt-1 text-sm text-[#05061D]">
							On regarde ensemble ce que cette offre changerait vraiment pour
							vous.
						</p>
					</div>

					<div className="px-5 pb-6">
						<ChangeOfferContent
							selectedPlan={selectedPlan}
							onSelect={setSelectedPlan}
							onConfirm={handleConfirm}
							isDesktop
							prices={prices}
						/>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	/* ── Mobile → Drawer (bottom) ── */
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				{headerImage}
				<div className="px-5 pt-4 pb-2 text-left">
					<DrawerTitle className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#34266D]">
						Changer d{"'"}offre
					</DrawerTitle>
					<p className="mt-1 text-sm text-[#05061D]">
						On regarde ensemble ce que cette offre changerait vraiment pour
						vous.
					</p>
				</div>

				<div className="px-5 py-4 overflow-y-auto">
					<ChangeOfferContent
						selectedPlan={selectedPlan}
						onSelect={setSelectedPlan}
						onConfirm={handleConfirm}
						isDesktop={false}
						prices={prices}
					/>
				</div>

				<DrawerFooter className="px-5 pb-6 pt-2">
					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold gap-2"
						onClick={handleConfirm}
					>
						Choisir l{"'"}offre {capitalize(selectedPlan)}
						<Check className="h-5 w-5" />
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
