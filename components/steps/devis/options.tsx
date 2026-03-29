"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import offersData from "@/data/offers.json";
import optionsJson from "@/data/options.json";
import { OptionDetailsDrawer, OptionDetails } from "./drawers/option-details-drawer";

const optionsData = optionsJson as Record<string, OptionDetails[]>;

/* ------------------------------------------------------------------ */
/*  Helper: Parse & Format price strings (e.g. "54,23€" -> 54.23)    */
/* ------------------------------------------------------------------ */
const parsePrice = (priceStr: string) => {
	const numStr = priceStr.replace('€', '').replace(',', '.').trim();
	return parseFloat(numStr) || 0;
};

const formatPrice = (priceNum: number) => {
	return priceNum.toFixed(2).replace('.', ',') + '€';
};

/* ------------------------------------------------------------------ */
/*  OptionCard Variants                                              */
/* ------------------------------------------------------------------ */

const outerCardVariants = cva(
	"w-full rounded-[28px] p-[3px] pb-0 overflow-hidden transition-colors duration-300",
	{
		variants: {
			selected: {
				false: "bg-[#F3E5FA]",
				true: "bg-[#490076]",
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
);

const topTextVariants = cva(
	"text-sm font-semibold transition-colors duration-300",
	{
		variants: {
			selected: {
				false: "text-[#490076]",
				true: "text-white",
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
);

const bottomButtonVariants = cva(
	"inline-flex items-center gap-1 text-sm font-medium transition-colors duration-300 hover:opacity-80 active:scale-95 active:opacity-60",
	{
		variants: {
			selected: {
				false: "text-[#490076]",
				true: "text-white",
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
);

/* ------------------------------------------------------------------ */
/*  Options Page Component                                           */
/* ------------------------------------------------------------------ */

export function OptionsStep() {
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

	const availableOptions = useMemo(() => {
		return optionsData[baseOffer.plan] || [];
	}, [baseOffer]);

	// Compute total price
	const totalPrice = useMemo(() => {
		let total = parsePrice(baseOffer.price);
		availableOptions.forEach((opt) => {
			if (selectedOptions.includes(opt.id)) {
				total += parsePrice(opt.price);
			}
		});
		return formatPrice(total);
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

	return (
		<div className="flex flex-col h-full lg:px-6">
			{/* Mobile hero section bg extension similar to DevisVariantA */}
			<div className="-mx-4 -mt-4 bg-[#F3E5FA] px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:mx-0 lg:mt-0 lg:bg-transparent lg:px-0 lg:py-0">
				<h1 className="text-4xl font-bold leading-tight text-[#290E67]">
					Renforcez votre couverture
				</h1>
			</div>

			<div className="flex flex-col gap-5 pt-8 pb-48">
				{availableOptions.map((opt, index) => {
					const isSelected = selectedOptions.includes(opt.id);

					return (
						<div
							key={opt.id}
							className={outerCardVariants({ selected: isSelected })}
						>
							{/* Outer Top: Option n° (Centered) */}
							<div className="flex items-center justify-center px-5 pt-3 pb-3">
								<span className={topTextVariants({ selected: isSelected })}>
									Option n°{index + 1}
								</span>
							</div>

							{/* Inner White Card */}
							<div className="rounded-[25px] bg-white ring-1 ring-[#EADFF1] px-5 py-5 overflow-hidden">
								<div className="flex items-start justify-between">
									<div className="text-[1.1rem] leading-none font-bold text-[#490076] pr-4">
										{opt.title}
									</div>
									<Image
										src="/options/illustration=Sante.svg"
										alt="Santé"
										width={40}
										height={40}
										className="shrink-0"
										onError={(e) => { e.currentTarget.style.display = 'none'; }}
									/>
								</div>
								
								<p className="text-[0.9rem] leading-snug text-[#490076] opacity-90 mt-2 mb-4">
									{opt.description}
								</p>
								
								<div className="flex items-center justify-between mt-auto">
									<div className="flex items-end gap-0.5">
										<span className="font-bold tracking-tight text-[#9000E3] text-[1.75rem] leading-none">
											{opt.price}
										</span>
										<span className="font-semibold text-[#490076] text-sm mb-0.5">
											/mois
										</span>
									</div>
									<Switch
										variant="gradient"
										size="sm"
										checked={isSelected}
										onCheckedChange={(checked) => handleToggleOption(opt.id, checked)}
										className="h-6 w-[48px] rounded-[10px] [&_[data-slot=switch-thumb]]:h-[20px] [&_[data-slot=switch-thumb]]:w-[20px] [&_[data-slot=switch-thumb]]:rounded-[8px] [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-6"
									/>
								</div>
							</div>

							{/* Outer Bottom: En savoir plus */}
							<div className="flex items-center justify-center px-5 pt-3 pb-4">
								<button
									type="button"
									onClick={() => openDrawer(opt)}
									className={bottomButtonVariants({ selected: isSelected })}
								>
									En savoir plus
									<ChevronRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					);
				})}
				
				{availableOptions.length === 0 && (
					<div className="text-center py-10 text-[#490076]">
						Aucune option supplémentaire disponible pour cette offre.
					</div>
				)}
			</div>

			{/* Bottom Bar: Matches exact offer card layout */}
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white ring-1 ring-[#EADFF1] z-10 lg:static lg:bg-transparent lg:ring-0 lg:p-0 lg:mt-auto">
				<div className="max-w-lg mx-auto w-full">
					{/* Plan info replicating offer-card */}
					<div className="flex items-start justify-between gap-3 mb-4">
						<div className="min-w-0">
							<div className="capitalize font-bold text-[#490076] text-[1.1rem] leading-none">
								{baseOffer.plan}
							</div>
							<div className="mt-1 flex items-center gap-2">
								<div className="flex items-end gap-0.5">
									<span className="font-bold tracking-tight text-[#9000E3] text-[2rem] leading-none">
										{totalPrice}
									</span>
									<span className="font-semibold text-[#490076] mb-0.5 text-sm">
										/mois
									</span>
								</div>
								{/* Pill for options */}
								{selectedOptions.length > 0 && (
									<div className="ml-2 flex items-center gap-1 bg-[#FBF4EA] px-3 py-1 rounded-full ring-1 ring-[#EADFF1]">
										<span className="text-[#490076] text-sm font-semibold">
											Options + {selectedOptions.length}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* CTA Button matching OfferCard exact styling */}
					<Button
						variant="ctaPurple"
						size="cta"
						className="w-full bg-[#5B007F] hover:bg-[#6A0B95] rounded-[20px] h-[52px] text-sm font-semibold lg:h-12 lg:px-6 lg:text-[0.95rem]"
						onClick={next}
					>
						Continuer
					</Button>
				</div>
			</div>

			<OptionDetailsDrawer 
				open={drawerOpen} 
				onOpenChange={setDrawerOpen} 
				option={activeOption} 
				selectedOptions={selectedOptions}
				onToggle={handleToggleOption}
			/>
		</div>
	);
}
