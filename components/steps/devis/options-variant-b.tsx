"use client";

import { useMemo, useState } from "react";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { useSituationForm } from "@/context/SituationFormContext";
import { PLAN_DISPLAY_KEYS } from "@/lib/plans";
import { optionsData } from "@/lib/options";
import { OptionCard } from "@/components/ui/option-card";
import { TotalSummary } from "@/components/ui/total-summary";
import { DevisSideCard } from "@/components/ui/devis-side-card";
import { OptionDetailsDrawer } from "./drawers/option-details-drawer";
import type { OptionDetails } from "@/lib/options";

const PLAN_KEYS = PLAN_DISPLAY_KEYS;

/* ------------------------------------------------------------------ */
/*  Options Page – Variant B                                         */
/* ------------------------------------------------------------------ */

export function OptionsVariantB() {
	const { next } = useStepper();
	const { session } = useSituationForm();
	const { value: selectedOfferIndex } = useSessionStorage<number | null>(
		"selectedOffer",
		0,
	);
	const { value: selectedOptions = [], setValue: setSelectedOptions } = useSessionStorage<string[]>(
		"selectedOptions",
		[],
	);

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [activeOption, setActiveOption] = useState<OptionDetails | null>(null);

	const planIndex = session.selectedPlan ?? 0;
	const planName = PLAN_KEYS[planIndex] ?? "Bronze";
	const basePrice = session.plans?.[planName] ?? "0";

	const availableOptions = optionsData;

	// Compute total price
	const totalPrice = useMemo(() => {
		let total = parsePrice(basePrice);
		availableOptions.forEach((opt) => {
			if (selectedOptions.includes(opt.id)) {
				total += parsePrice(opt.price);
			}
		});
		return formatPriceLabel(total);
	}, [basePrice, availableOptions, selectedOptions]);

	const handleToggleOption = (id: string, checked: boolean) => {
		if (checked) {
			setSelectedOptions([...selectedOptions, id]);
		} else {
			setSelectedOptions(selectedOptions.filter((opt) => opt !== id));
		}
	};

	const openDrawer = (opt: OptionDetails) => {
		setActiveOption(opt);
		setDrawerOpen(true);
	};

	const renderOptionCards = () => (
		<>
			{availableOptions.map((opt, index) => {
				const isSelected = selectedOptions.includes(opt.id);

				return (
					<OptionCard
						key={opt.id}
						topLabel={`Option n°${index + 1}`}
						title={opt.title}
						description={opt.description}
						price={opt.price}
						selected={isSelected}
						onToggle={(checked) => handleToggleOption(opt.id, checked)}
						onMoreClick={() => openDrawer(opt)}
					/>
				);
			})}
			
			{availableOptions.length === 0 && (
				<div className="text-center py-10 text-[#490076]">
					Aucune option supplémentaire disponible pour cette offre.
				</div>
			)}
		</>
	);

	return (
		<>
			{/* ─── Mobile layout (<lg) ─── */}
			<div className="flex flex-col h-full lg:hidden">
				{/* Mobile hero section bg extension similar to DevisVariantA */}
				<div className="-mx-4 -mt-4  px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6">
					<h1 className="text-4xl font-bold leading-tight text-[#290E67]">
						Renforcez votre couverture
					</h1>
				</div>

				<div className="flex flex-col gap-5 pt-8 pb-48">
					{renderOptionCards()}
				</div>

				{/* Bottom Bar */}
				<div className="fixed bottom-0 left-0 right-0 p-4 bg-white ring-1 ring-[#EADFF1] z-10">
					<TotalSummary
						planName={planName}
						totalPrice={totalPrice}
						optionCount={selectedOptions.length}
						onContinue={next}
						ctaLabel="Continuer"
						className="max-w-lg mx-auto"
					/>
				</div>
			</div>

			{/* ─── Desktop layout (lg+) ─── */}
			<div className="hidden lg:flex w-full bg-[#F6F4F0] min-h-screen">
				<div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto py-10 w-full px-4 lg:px-8">
				{/* ── Left Column ── */}
				<div className="lg:col-span-4 flex flex-col gap-6">
						<DevisSideCard
							title={<>Renforcez votre<br/>couverture</>}
							subtitle="Ajoutez des garanties de prévoyance ou une surcomplémentaire santé pour une protection plus complète."
						>
							<TotalSummary
								card
								planName={planName}
								totalPrice={totalPrice}
								optionCount={selectedOptions.length}
								onContinue={next}
								ctaLabel="Continuer"
							/>
						</DevisSideCard>
					</div>

					{/* ── Right Column ── */}
					<div className="lg:col-span-8 flex flex-col gap-5 pb-10">
						{renderOptionCards()}
					</div>
				</div>
			</div>

			<OptionDetailsDrawer 
				open={drawerOpen} 
				onOpenChange={setDrawerOpen} 
				option={activeOption} 
				selectedOptions={selectedOptions}
				onToggle={handleToggleOption}
			/>
		</>
	);
}
