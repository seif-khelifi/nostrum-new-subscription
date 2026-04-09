"use client";

import { useMemo, useState } from "react";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { OptionCard } from "@/components/ui/option-card";
import { TotalSummary } from "@/components/ui/total-summary";
import offersData from "@/data/offers.json";
import optionsJson from "@/data/options.json";
import { OptionDetailsDrawer, OptionDetails } from "./drawers/option-details-drawer";

const optionsData = optionsJson as OptionDetails[];

/* ------------------------------------------------------------------ */
/*  Options Page – Variant B                                         */
/* ------------------------------------------------------------------ */

export function OptionsVariantB() {
	const { next } = useStepper();
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

	// Map selectedOffer index to base plan
	const baseOffer = useMemo(() => {
		const idx = selectedOfferIndex ?? 0;
		return offersData.offers[idx] || offersData.offers[0];
	}, [selectedOfferIndex]);

	const availableOptions = optionsData;

	// Compute total price
	const totalPrice = useMemo(() => {
		let total = parsePrice(baseOffer.price);
		availableOptions.forEach((opt) => {
			if (selectedOptions.includes(opt.id)) {
				total += parsePrice(opt.price);
			}
		});
		return formatPriceLabel(total);
	}, [baseOffer.price, availableOptions, selectedOptions]);

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
						planName={baseOffer.plan}
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
						<div className="bg-[#F6F4F0] border-4 border-white rounded-[24px] overflow-hidden flex flex-col min-h-[500px]">
							<div className="p-6 pt-8 flex-1">
								<h1 className="text-3xl font-bold font-[family-name:var(--font-bricolage-grotesque)] leading-tight text-black mb-4">
									Renforcez votre<br/>couverture
								</h1>
								<p className="text-[#1D1B20] text-[0.95rem] leading-relaxed mb-8">
									Ajoutez des garanties de prévoyance ou une surcomplémentaire santé pour une protection plus complète.
								</p>
							</div>

							<div className="mt-auto">
								<TotalSummary
									card
									planName={baseOffer.plan}
									totalPrice={totalPrice}
									optionCount={selectedOptions.length}
									onContinue={next}
									ctaLabel="Continuer"
								/>
							</div>
						</div>
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
