"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { useSituationForm } from "@/context/SituationFormContext";
import { parsePrice, formatPriceLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OptionSelectCard } from "@/components/ui/option-select-card";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import optionsJson from "@/data/options.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OptionEntry = {
	id: string;
	title: string;
	description: string;
	price: string;
};

const optionsData = optionsJson as OptionEntry[];
const PLAN_KEYS = ["Découverte", "Bronze", "Silver", "Gold"] as const;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ChangeOptionsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChangeOptionsDrawer({
	open,
	onOpenChange,
}: ChangeOptionsDrawerProps) {
	const { session } = useSituationForm();

	const { value: selectedOptions = [], setValue: setSelectedOptions } =
		useSessionStorage<string[]>("selectedOptions", []);

	/* ── Local selection state (committed on confirm) ── */
	const [localSelected, setLocalSelected] = useState<string[]>(selectedOptions);

	/* Sync local state when drawer opens */
	useEffect(() => {
		if (open) setLocalSelected(selectedOptions);
	}, [open, selectedOptions]);

	/* ── Unselected options (based on persisted selection) ── */
	const unselectedOptions = useMemo(
		() => optionsData.filter((opt) => !selectedOptions.includes(opt.id)),
		[selectedOptions],
	);

	/* ── Total price preview (base plan + local selection) ── */
	const planIndex = session.selectedPlan ?? 0;
	const planName = PLAN_KEYS[planIndex] ?? "Bronze";
	const basePrice = session.plans?.[planName] ?? "0";

	const totalPrice = useMemo(() => {
		let total = parsePrice(basePrice);
		optionsData.forEach((opt) => {
			if (localSelected.includes(opt.id)) {
				total += parsePrice(opt.price);
			}
		});
		return formatPriceLabel(total);
	}, [basePrice, localSelected]);

	/* ── Toggle local selection ── */
	const handleToggle = (id: string) => {
		setLocalSelected((prev) =>
			prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
		);
	};

	/* ── Confirm handler — persist to session storage ── */
	const handleConfirm = () => {
		setSelectedOptions(localSelected);
		onOpenChange(false);
	};

	const newlySelected = localSelected.filter(
		(id) => !selectedOptions.includes(id),
	);

	return (
		<ResponsiveDrawer
			open={open}
			onOpenChange={onOpenChange}
			title="J'ajoute une option"
			description="On regarde ensemble ce que cette offre changerait vraiment pour vous."
			footer={
				<>
					{/* Total price bar */}
					<div className="flex items-end justify-between mb-3">
						<div>
							<div className="font-bold text-[#9000E3] text-sm leading-none">
								Total
							</div>
							<div className="mt-1 flex items-end gap-0.5">
								<span className="font-bold tracking-tight text-[#9000E3] text-[1.5rem] leading-none">
									{totalPrice}
								</span>
								<span className="font-semibold text-[#490076] text-xs mb-0.5">
									/mois
								</span>
							</div>
						</div>
					</div>

					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] min-h-[52px] h-auto py-3 px-6 text-sm font-semibold gap-2"
						onClick={handleConfirm}
					>
						{newlySelected.length > 0
							? `Ajouter ${newlySelected.length} option${newlySelected.length > 1 ? "s" : ""}`
							: "Confirmer"}
						<Check className="h-5 w-5" />
					</Button>
				</>
			}
		>
			<div className="px-5 py-4 overflow-y-auto">
				<div className="flex flex-col gap-3">
					{unselectedOptions.length > 0 ? (
						unselectedOptions.map((opt) => (
							<OptionSelectCard
								key={opt.id}
								title={opt.title}
								description={opt.description}
								price={opt.price}
								selected={localSelected.includes(opt.id)}
								onSelect={() => handleToggle(opt.id)}
							/>
						))
					) : (
						<div className="rounded-2xl border border-[#E9E3DD] px-4 py-6 text-center text-[#490076] opacity-60 text-sm">
							Toutes les options sont déjà sélectionnées
						</div>
					)}
				</div>
			</div>
		</ResponsiveDrawer>
	);
}
