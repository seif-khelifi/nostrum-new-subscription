"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerFooter,
	DrawerClose,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import offersData from "@/data/offers.json";

/* ------------------------------------------------------------------ */
/*  Offer definitions for the 2×2 grid                                 */
/* ------------------------------------------------------------------ */

type OfferOption = {
	plan: string;
	label: string;
	price: string;
};

const OFFER_OPTIONS: OfferOption[] = offersData.offers.map((o) => ({
	plan: o.plan,
	label: o.plan.charAt(0).toUpperCase() + o.plan.slice(1),
	price: o.price,
}));

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface GarantiesCompareDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Drawer for variant B garanties — allows user to pick offers to compare.
 *
 * - Top-left: illustration from `/drawers/drawer-garanties-b.svg`
 * - Title / subtitle (normal font, left-aligned)
 * - 2×2 grid of offer switch cards
 * - "Valider" button → navigates to `offre_comparateur` step
 */
export function GarantiesCompareDrawer({
	open,
	onOpenChange,
}: GarantiesCompareDrawerProps) {
	const { goToStepById } = useStepper();
	const { setValue: setCompareOffers } = useSessionStorage<string[]>(
		"compareOffers",
		[],
	);

	const [selected, setSelected] = useState<Set<string>>(new Set());

	const toggle = (plan: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(plan)) {
				next.delete(plan);
			} else {
				next.add(plan);
			}
			return next;
		});
	};

	const hasSelection = selected.size > 0;

	const handleValidate = () => {
		setCompareOffers(Array.from(selected));
		onOpenChange(false);
		goToStepById("offre_comparateur");
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				{/* Logo illustration — top-left, adjusted size */}
				<div className="px-5 pt-5">
					<Image
						src="/drawers/drawer-garanties-b.svg"
						alt="Comparer les offres"
						width={48}
						height={48}
						className="h-12 w-12"
					/>
				</div>

				{/* Title + subtitle — normal font (Inter), left-aligned */}
				<div className="px-5 pt-4 pb-2 text-left">
					<DrawerTitle className="font-[family-name:var(--font-inter)] text-xl font-bold text-[#34266D]">
						Comparer avec votre situation actuelle
					</DrawerTitle>
					<p className="mt-1 text-sm text-[#05061D]">
						On regarde ensemble ce que cette offre changerait vraiment pour vous.
					</p>
				</div>

				{/* 2×2 offer switch grid */}
				<div className="grid grid-cols-2 gap-3 px-5 py-4">
					{OFFER_OPTIONS.map((offer) => {
						const isChecked = selected.has(offer.plan);
						return (
							<label
								key={offer.plan}
								className={[
									"flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-all",
									isChecked
										? "border-2 border-[#CE99FF]"
										: "border border-[#E9E3DD]",
								].join(" ")}
							>
								{/* Offer name + price */}
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-semibold text-[#290E67]">
										{offer.label}
									</span>
									<span className="text-base font-bold text-[#490076]">
										{offer.price}
									</span>
								</div>

								{/* Switch — compact size, squared profile */}
								<Switch
									variant="gradient"
									size="sm"
									checked={isChecked}
									onCheckedChange={() => toggle(offer.plan)}
									className="h-6 w-[48px] rounded-[10px] [&_[data-slot=switch-thumb]]:h-[20px] [&_[data-slot=switch-thumb]]:w-[20px] [&_[data-slot=switch-thumb]]:rounded-[8px] [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-6"
								/>
							</label>
						);
					})}
				</div>

				<DrawerFooter className="px-5 pb-6">
					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] h-[52px] px-6 text-sm font-semibold"
						disabled={!hasSelection}
						onClick={handleValidate}
					>
						Valider
						<Check className="ml-2 h-5 w-5" />
					</Button>
					<DrawerClose asChild>
						<Button
							variant="outline"
							className="w-full rounded-[24px] h-[48px]"
						>
							Annuler
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
