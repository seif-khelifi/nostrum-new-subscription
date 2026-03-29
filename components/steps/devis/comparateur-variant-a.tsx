"use client";

import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { OfferCard } from "@/components/ui/offer-card";
import type { OfferPlan } from "@/components/ui/offer-card";
import { PlanLogo } from "@/components/ui/plan-logo";
import { GarantieCompareBreakdownCard } from "@/components/ui/garantie-compare-breakdown-card";
import type { CompareOfferItem } from "@/components/ui/garantie-compare-breakdown-card";
import type { BreakdownValues } from "@/components/ui/garantie-breakdown-card";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui/tabs";
import offersData from "@/data/offers.json";
import garantiesData from "@/data/garanties-variant-b.json";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------------------ */
/*  Legend pills                                                        */
/* ------------------------------------------------------------------ */

const LEGEND_ITEMS = [
	{
		label: "Assurance maladie",
		style: { backgroundColor: "#290E67" },
	},
	{
		label: "Nostrum Care",
		style: {
			background:
				"linear-gradient(86.29deg, #9000E3 1.49%, #CE99FF 45.06%, #FEA8CD 72.53%, #EFFB7D 100%)",
		},
	},
	{
		label: "Votre reste",
		style: { backgroundColor: "#CE99FF" },
	},
] as const;

/* ------------------------------------------------------------------ */
/*  Data types for the JSON tab structure                               */
/* ------------------------------------------------------------------ */

type CategoryMeta = {
	key: string;
	icon: string;
	title: string;
	subtitle: string;
};

type TabBreakdowns = Record<string, BreakdownValues>;
type OfferTabs = { sante: TabBreakdowns; bienetre: TabBreakdowns };
type AllTabs = Record<string, OfferTabs>;

const categories: CategoryMeta[] = garantiesData.categories as CategoryMeta[];
const tabsData: AllTabs = garantiesData.tabs as AllTabs;

/* ------------------------------------------------------------------ */
/*  ComparateurVariantA                                               */
/* ------------------------------------------------------------------ */

export function ComparateurVariantA() {
	const { goToStepById } = useStepper();
	const { value: storedCompareOffers } = useSessionStorage<string[]>("compareOffers", []);
	
	// Fallback to ["bronze", "silver"] for development preview if empty
	const compareOffersIds = storedCompareOffers?.length ? storedCompareOffers : ["bronze", "silver"];

	// Map IDs to actual offer data
	const selectedOffers = compareOffersIds.map(id => {
		return offersData.offers.find(o => o.plan === id) || offersData.offers[1];
	});

	/** Render all 5 category sections for a given tab key */
	const renderTabCategories = (tabKey: "sante" | "bienetre") => {
		return (
			<div className="-mx-4 sm:-mx-6">
				{categories.map((cat, idx) => {
					// Build the offers array for this category
					const categoryOffers: CompareOfferItem[] = selectedOffers.map((offer) => {
						const planName = offer.plan;
						const offerTabs: OfferTabs = tabsData[planName] ?? tabsData.silver;
						const breakdowns: TabBreakdowns = offerTabs[tabKey] ?? {};
						const breakdown = breakdowns[cat.key] ?? {};

						return {
							offerLabel: capitalize(planName),
							breakdown,
						};
					});

					return (
						<div
							key={cat.key}
							className="px-4 py-5 sm:px-6"
							style={{ backgroundColor: idx % 2 === 0 ? "#FAF4FB" : "#FFFFFF" }}
						>
							{/* Icon + title */}
							<div className="flex items-center gap-2.5">
								<span className="text-[1.35rem]" aria-hidden>
									{cat.icon}
								</span>
								<p className="text-[1.35rem] font-bold leading-tight text-[#490076]">
									{cat.title}
								</p>
							</div>

							{/* Subtitle — indented to align with title text */}
							<p className="mt-1 pl-[34px] text-sm leading-relaxed text-[#1D1B20]">
								{cat.subtitle}
							</p>

							{/* Compare Breakdown card */}
							<div className="mt-4">
								<GarantieCompareBreakdownCard offers={categoryOffers} />
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<>
			{/* ─── Mobile layout (<lg) ─── */}
			<div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white lg:hidden">
				{/* ── Top section ── */}
				<div className="bg-[#25003C] px-4 pt-6 pb-8 sm:px-6">
					
					<div className="mb-6 mt-2 flex justify-center">
						<Button
							variant="closeComparateur"
							onClick={() => goToStepById("garanties")}
						>
							Fermer le comparateur d{"'"}offres
							<span className="flex h-[26px] w-[42px] items-center justify-center rounded-full bg-[#360057] transition-colors hover:bg-[#4a0076]">
								<X className="h-4 w-4 text-[#F3E5FA]" />
							</span>
						</Button>
					</div>

					<h1 className="mt-2 font-[family-name:var(--font-bricolage-grotesque)] text-3xl font-bold leading-tight text-white pr-8">
						Même soins. Pas le même résultat.
					</h1>

					<p className="mt-4 text-[15px] leading-relaxed text-white opacity-90 pr-4">
						Moins de reste, plus de sérénité sur vos soins.
					</p>

					<div className="mt-8 flex flex-col gap-4">
						{selectedOffers.map((offer) => (
							<OfferCard
								key={offer.plan}
								plan={offer.plan as OfferPlan}
								tone="default"
								size="default"
								price={offer.price}
								period={offer.period}
								descriptionTitle={offer.descriptionTitle ?? ""}
								description={""}
								hideCta
								logo={<PlanLogo plan={offer.plan} />}
							/>
						))}
					</div>
				</div>

				{/* ── Legend + Tabs section ── */}
				<div className="px-4 pt-8 pb-12 sm:px-6">
					{/* Title */}
					<p className="text-base font-semibold text-[#290E67]">
						Projetez-vous dans vos prochains soins
					</p>

					{/* Subtitle */}
					<p className="mt-1 text-sm text-[#1D1B20]">
						Simulez vos soins habituels et voyez votre reste à charge.
					</p>

					{/* Legend — single line */}
					<div className="mt-4 flex items-center justify-center gap-3">
						{LEGEND_ITEMS.map((item) => (
							<div key={item.label} className="flex items-center gap-1.5">
								<span
									className="inline-block h-2 w-4 rounded-full shrink-0"
									style={item.style}
								/>
								<span className="text-[11px] font-medium text-[#1D1B20]">{item.label}</span>
							</div>
						))}
					</div>

					{/* Tabs */}
					<div className="mt-6">
						<Tabs defaultValue="sante" className="w-full">
							<TabsList variant="essential">
								<TabsTrigger
									value="sante"
									variant="essential"
									icon={<span aria-hidden>💘</span>}
								>
									Santé essentielle
								</TabsTrigger>
								<TabsTrigger
									value="bienetre"
									variant="essential"
									icon={<span aria-hidden>🧠</span>}
								>
									Bien-être &amp; équilibre
								</TabsTrigger>
							</TabsList>

							<TabsContent value="sante">
								{renderTabCategories("sante")}
							</TabsContent>

							<TabsContent value="bienetre">
								{renderTabCategories("bienetre")}
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>

			{/* ─── Desktop placeholder (lg+) ─── */}
			<div className="hidden items-center justify-center py-16 lg:flex flex-col gap-4">
				<p className="text-lg text-[#444444]">
					Version desktop à venir — veuillez utiliser la version mobile.
				</p>
			</div>
		</>
	);
}
