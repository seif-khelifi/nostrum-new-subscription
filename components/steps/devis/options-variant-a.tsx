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
					"font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#1D1B20] pb-2 sm:pb-4" +
					(texts.navbarTitle ? " sm:hidden" : "")
				}
			>
				{texts.title}
			</h1>

			{/* 2-column card grid */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-3xl">
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

			{/* Bottom bar — visible whenever the right sidebar is NOT.
			    The right sidebar (which hosts the TotalSummary on desktop) only
			    appears at `lg+`, so we must show this bar on everything below lg,
			    not just below sm. Otherwise between 640–1023px the user had no
			    accessible CTA. */}
			{/* Bar sits flush against the left sidebar so its content (the
			    price on the left edge) isn't covered. At `sm`–`lg` the left
			    sidebar is `w-[120px]`; above `lg` the bar is hidden entirely
			    because the right sidebar's TotalSummary takes over. This
			    mirrors how the main column is offset in `DesktopShell`
			    (`sm:ml-[120px]`). */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 sm:left-[120px] p-4 bg-white ring-1 ring-[#EADFF1] z-10">
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
