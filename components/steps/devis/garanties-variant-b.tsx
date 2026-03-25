"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useStepper } from "@/context/StepperContext";
import { useSessionStorage } from "@/hooks/use-session-storage";
import { Button } from "@/components/ui/button";
import { GarantiesCompareDrawer } from "./drawers";
import { OfferCard, CompareCard } from "@/components/ui/offer-card";
import type { OfferPlan } from "@/components/ui/offer-card";
import { PlanLogo } from "@/components/ui/plan-logo";
import { GarantieBreakdownCard } from "@/components/ui/garantie-breakdown-card";
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

const PLAN_INDEX: Record<string, number> = {
	decouverte: 0,
	bronze: 1,
	silver: 2,
	gold: 3,
};

const OFFER_BG_COLORS: Record<string, string> = garantiesData.offerColors;

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
/*  GarantiesVariantB                                                  */
/* ------------------------------------------------------------------ */

export function GarantiesVariantB() {
	const { goToStepById } = useStepper();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { value: selectedOfferIndex } = useSessionStorage<number | null>("selectedOffer", null);
	const { value: moreOfferIndex } = useSessionStorage<number | null>("moreOffer", null);

	const offerIndex = moreOfferIndex ?? selectedOfferIndex ?? 2;
	const offer = offersData.offers[offerIndex];
	const planName = offer?.plan ?? "silver";
	const bgColor = OFFER_BG_COLORS[planName] ?? "#F4F3FA";
	const compare = offersData.compareCard;
	const common = garantiesData.common;

	// Also persist price in session storage
	const { setValue: setSelectedOffer } = useSessionStorage<number | null>("selectedOffer", null);
	const { setValue: setSelectedPrice } = useSessionStorage<string | null>("selectedOfferPrice", null);

	// Resolve tab data for the current offer
	const offerTabs: OfferTabs = tabsData[planName] ?? tabsData.silver;
	const offerLabel = capitalize(planName);

	const handleChooseOffer = () => {
		setSelectedOffer(PLAN_INDEX[planName] ?? 0);
		setSelectedPrice(offer?.price ?? null);
		goToStepById("sexe");
	};

	/** Render all 5 category sections for a given tab key */
	const renderTabCategories = (tabKey: "sante" | "bienetre") => {
		const breakdowns: TabBreakdowns = offerTabs[tabKey] ?? {};
		return (
			<div className="-mx-4 sm:-mx-6">
				{categories.map((cat, idx) => (
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
							<h4 className="text-[1.35rem] font-bold leading-tight text-[#490076]">
								{cat.title}
							</h4>
						</div>

						{/* Subtitle — indented to align with title text */}
						<p className="mt-1 pl-[34px] text-sm leading-relaxed text-[#1D1B20]">
							{cat.subtitle}
						</p>

						{/* Breakdown card */}
						<div className="mt-3">
							<GarantieBreakdownCard
								offerLabel={offerLabel}
								breakdown={breakdowns[cat.key] ?? {}}
							/>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<>
			{/* ─── Mobile layout (<lg) ─── */}
			<div className="flex flex-col lg:hidden">
				{/* ── Colored hero section ── */}
				<div className="-mx-4 -mt-4 px-4 pt-6 pb-8 sm:-mx-6 sm:-mt-6 sm:px-6" style={{ backgroundColor: bgColor }}>
					<h3 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold leading-tight text-[#290E67]">
						{common.title}
					</h3>

					<p className="mt-2 text-base font-semibold text-[#1D1B20]">
						{common.subtitleTemplate.replace("{offer}", offerLabel)}
					</p>

					<div className="mt-6">
						<OfferCard
							plan={planName as OfferPlan}
							tone="default"
							size="default"
							price={offer?.price ?? ""}
							period={offer?.period}
							descriptionTitle={offer?.descriptionTitle ?? ""}
							description={offer?.description ?? ""}
							hideCta
							logo={<PlanLogo plan={planName} />}
						/>
					</div>

					<div className="mt-4 flex items-center justify-center">
						<Button variant="linkChevron" type="button">
							{common.seeGuaranteesLabel}
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* ── Legend + Tabs section ── */}
				<div className="pt-8">
					{/* Title */}
					<p className="text-base font-semibold text-[#290E67]">
						Projetez-vous dans vos prochains soins
					</p>

					{/* Subtitle */}
					<p className="mt-1 text-sm text-[#1D1B20]">
						Simulez vos soins habituels et voyez votre reste à charge.
					</p>

					{/* Legend — single line */}
					<div className="mt-3 flex items-center justify-center gap-3">
						{LEGEND_ITEMS.map((item) => (
							<div key={item.label} className="flex items-center gap-1">
								<span
									className="inline-block h-2 w-4 rounded-full shrink-0"
									style={item.style}
								/>
								<span className="text-[11px] text-[#1D1B20]">{item.label}</span>
							</div>
						))}
					</div>

					{/* Tabs */}
					<div className="mt-5">
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

				{/* ── Compare card ── */}
					<div className="pb-4 pt-6">
						<CompareCard
							title={compare.title}
							description={compare.description}
							ctaLabel={compare.ctaLabel}
							onCtaClick={() => setDrawerOpen(true)}
						/>
					</div>
	
					{/* ── Bottom Drawer — compare offers (extracted component) ── */}
					<GarantiesCompareDrawer
						open={drawerOpen}
						onOpenChange={setDrawerOpen}
					/>

				{/* ── Bottom CTA ── */}
				<div className="pb-8 pt-4">
					<Button
						variant="ctaPurple"
						className="w-full rounded-[24px] h-[52px] px-6 text-sm font-semibold bg-[#9000E3] hover:bg-[#7B00C4]"
						onClick={handleChooseOffer}
					>
						{common.ctaTemplate.replace("{offer}", offerLabel)}
						<ArrowRight className="ml-2 h-5 w-5" />
					</Button>
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
