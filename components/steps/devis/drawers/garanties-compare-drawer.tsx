"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { OFFER_OPTIONS } from "@/lib/plans";
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
import { OfferSwitchGrid } from "@/components/ui/offer-switch-grid";

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
	const { launchSubFlow } = useStepper();
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
		launchSubFlow(["offre_comparateur"], "devis_placeholder");
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
			<OfferSwitchGrid offers={OFFER_OPTIONS} selected={Array.from(selected)} onToggle={toggle} className="px-5 py-4" />

				<DrawerFooter className="px-5 pb-6">
					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold"
						disabled={!hasSelection}
						onClick={handleValidate}
					>
						Valider
						<Check className="ml-2 h-5 w-5" />
					</Button>
					<DrawerClose asChild>
						<Button
							variant="outline"
							className="w-full rounded-[24px] min-h-[48px] h-auto py-3"
						>
							Annuler
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
