"use client";

import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Info as InfoIcon } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { AlertBanner } from "@/components/ui/alert";
import offersData from "@/data/offers.json";
import garantiesData from "@/data/garanties-variant-b.json";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
	const { value: storedCompareOffers, setValue: setStoredCompareOffers } = useSessionStorage<string[]>("compareOffers", []);
	
	// Fallback to ["bronze", "silver"] for development preview if empty
	const compareOffersIds = storedCompareOffers?.length ? storedCompareOffers : ["bronze", "silver"];

	const toggleOffer = (plan: string) => {
		const current = new Set(compareOffersIds);
		if (current.has(plan)) {
			if (current.size > 1) {
				current.delete(plan);
				setStoredCompareOffers(Array.from(current));
			}
		} else {
			current.add(plan);
			setStoredCompareOffers(Array.from(current));
		}
	};

	// Map IDs to actual offer data
	const selectedOffers = compareOffersIds.map(id => {
		return offersData.offers.find(o => o.plan === id) || offersData.offers[1];
	});

	/** Render all 5 category sections for a given tab key */
	const renderTabCategories = (tabKey: "sante" | "bienetre", isDesktop = false) => {
		return (
			<div className={isDesktop ? "flex flex-col gap-4" : "-mx-4 sm:-mx-6"}>
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
							className={isDesktop ? "bg-white rounded-[24px] p-6 shadow-sm" : "px-4 py-5 sm:px-6"}
							style={isDesktop ? undefined : { backgroundColor: idx % 2 === 0 ? "#FAF4FB" : "#FFFFFF" }}
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

			{/* ─── Desktop layout (lg+) ─── */}
			<div className="hidden lg:flex w-full bg-[#F6F4F0] min-h-screen">
				<div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto py-10 w-full px-4 lg:px-8">
					{/* ── Left Column ── */}
				<div className="lg:col-span-4 flex flex-col gap-6">
					
					{/* "Vos remboursements" card with OfferCards */}
					<div className="bg-white rounded-[24px] overflow-hidden flex flex-col pt-6 px-6 pb-6 shadow-sm border border-[#E9E3DD]">
						<h1 className="font-bold text-black mb-6 text-xl text-center md:text-left">Vos remboursements</h1>
						
						{/* 2×2 offer switch grid */}
						<div className="grid grid-cols-2 gap-3 mb-6">
							{OFFER_OPTIONS.map((offer) => {
								const isChecked = compareOffersIds.includes(offer.plan);
								return (
									<label
										key={offer.plan}
										className={[
											"flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-all",
											isChecked
												? "border-2 border-[#CE99FF] bg-[#FAF4FB]"
												: "border border-[#E9E3DD] hover:border-[#CE99FF]/50",
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
											onCheckedChange={() => toggleOffer(offer.plan)}
											className="h-6 w-[48px] rounded-[10px] [&_[data-slot=switch-thumb]]:h-[20px] [&_[data-slot=switch-thumb]]:w-[20px] [&_[data-slot=switch-thumb]]:rounded-[8px] [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-6"
										/>
									</label>
								);
							})}
						</div>

						<div className="flex flex-col gap-4 mb-8">
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

						{/* "Revenir aux offres" button */}
						<div className="mt-auto">
							<Button
								variant="ghost"
								className="w-full h-[52px] rounded-[24px] bg-[#1D1B201A] text-black text-sm font-semibold hover:bg-[#1D1B202A] transition-colors flex items-center justify-center gap-2"
								onClick={() => goToStepById("garanties")}
							>
								<ArrowLeft className="h-4 w-4" />
								Revenir aux offres
							</Button>
						</div>
					</div>

					{/* AlertBanner Info Popup */}
					<div className="mt-2 text-left">
						<AlertBanner
							variant="info"
							title="Nostrum Care rembourse plus de 40 médecines douces:"
							subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
							icon={<InfoIcon className="size-5 text-[#9000E3]" />}
						/>
					</div>
				</div>

				{/* ── Right Column ── */}
				<div className="lg:col-span-8 flex flex-col gap-6">
					{/* "Votre comparatif" card */}
					<div className="bg-black rounded-[24px] p-6 text-white flex flex-col justify-start min-h-[140px]">
						<h1 className="text-3xl font-bold font-[family-name:var(--font-bricolage-grotesque)] leading-tight">
							Votre comparatif
						</h1>
					</div>

					{/* Tabs area */}
					<div className="w-full mt-2">
						<Tabs defaultValue="sante" className="w-full">
							<TabsList variant="essential" className="mb-6 w-full max-w-sm">
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
								{renderTabCategories("sante", true)}
							</TabsContent>

							<TabsContent value="bienetre">
								{renderTabCategories("bienetre", true)}
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
			</div>
		</>
	);
}
