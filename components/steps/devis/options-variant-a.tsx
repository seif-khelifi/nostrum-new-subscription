"use client";

import { useMemo, useState } from "react";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { useStepTexts } from "@/context/VariantContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { PLAN_DISPLAY_KEYS } from "@/lib/plans";
import { optionsData } from "@/lib/options";
import { OptionCard } from "@/components/ui/option-card";
import { TotalSummary } from "@/components/ui/total-summary";
import { OptionDetailsDrawer } from "./drawers/option-details-drawer";
import type { OptionDetails } from "@/lib/options";

const PLAN_KEYS = PLAN_DISPLAY_KEYS;

/* ------------------------------------------------------------------ */
/*  Options Page – Variant A                                          */
/*                                                                    */
/*  Uses the standard layout (sidebar + navbar visible).              */
/*  Cards in a 2-column centered grid; total summary in sidebar.      */
/* ------------------------------------------------------------------ */

export function OptionsVariantA() {
	const { next } = useStepper();
	const texts = useStepTexts("options");
	const { session } = useSituationForm();

	const { value: selectedOfferIndex } = useSessionStorage<number | null>(
		"selectedOffer",
		0,
	);
	const { value: selectedOptions = [], setValue: setSelectedOptions } =
		useSessionStorage<string[]>("selectedOptions", []);

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [activeOption, setActiveOption] = useState<OptionDetails | null>(null);

	const planIndex = session.selectedPlan ?? 0;
	const planName = PLAN_KEYS[planIndex] ?? "Bronze";
	const basePrice = session.plans?.[planName] ?? "0";

	const availableOptions = optionsData;

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

	return (
		<div className="flex flex-col gap-5 sm:gap-8 px-2 sm:pl-12 sm:pr-0">
			{/* Title — hidden on desktop when navbarTitle is set */}
			<h1
				className={
					"font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#1D1B20] pb-2 sm:pb-4 animate-fade-up" +
					(texts.navbarTitle ? " sm:hidden" : "")
				}
			>
				{texts.title}
			</h1>

			{/* 2-column card grid — staggered entrance */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-3xl [&>*]:animate-fade-up [&>*:nth-child(1)]:[animation-delay:80ms] [&>*:nth-child(2)]:[animation-delay:120ms] [&>*:nth-child(3)]:[animation-delay:160ms] [&>*:nth-child(4)]:[animation-delay:200ms] [&>*:nth-child(5)]:[animation-delay:240ms] [&>*:nth-child(n+6)]:[animation-delay:280ms]">
				{availableOptions.map((opt, index) => (
					<OptionCard
						key={opt.id}
						topLabel={`Option n°${index + 1}`}
						title={opt.title}
						description={opt.description}
						price={opt.price}
						selected={selectedOptions.includes(opt.id)}
						onToggle={(checked) => handleToggleOption(opt.id, checked)}
						onMoreClick={() => openDrawer(opt)}
					/>
				))}

				{availableOptions.length === 0 && (
					<div className="col-span-full text-center py-10 text-[#490076]">
						Aucune option supplémentaire disponible pour cette offre.
					</div>
				)}
			</div>

			{/*
			  Bottom bar — mobile/tablet (<lg). Slides up on enter so the
			  appearance of the sticky total feels like a distinct layer
			  arriving rather than a content block flashing in.
			*/}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 sm:left-[120px] p-4 bg-white ring-1 ring-[#EADFF1] z-10 animate-in slide-in-from-bottom-4 fade-in-0 duration-300 ease-out">
				<TotalSummary
					planName={planName}
					totalPrice={totalPrice}
					optionCount={selectedOptions.length}
					onContinue={next}
				/>
			</div>

			{/* Pad bottom for fixed bar — matches the bar's visibility */}
			<div className="h-32 lg:hidden" />

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
