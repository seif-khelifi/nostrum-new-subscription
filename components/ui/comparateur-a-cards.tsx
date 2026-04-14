"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn, capitalize } from "@/lib/utils";
import { type OfferPlan, ALL_PLANS, RECOMMENDED_OFFER } from "@/lib/plans";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	useCarousel,
	type CarouselApi,
} from "@/components/ui/carousel";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type CompareValues = {
	rembourse: number;
	resteACharge: number;
};

export type SectionMeta = {
	key: string;
	icon: string;
	title: string;
	subtitle: string;
	description: string;
};

/* ------------------------------------------------------------------ */
/*  VerticalProgressBar                                                */
/* ------------------------------------------------------------------ */

export function VerticalProgressBar({
	percentage,
	height = 56,
}: {
	percentage: number;
	height?: number;
}) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="text-[10px] font-bold text-[#CE99FF]">
				{Math.round(percentage)}%
			</span>
			<div
				className="relative w-2.5 rounded-full overflow-hidden bg-[#25013D]"
				style={{ height }}
			>
				<div
					className="absolute bottom-0 left-0 w-full rounded-full bg-[#CE99FF] transition-all duration-300"
					style={{ height: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  ComparateurCompareCard                                             */
/* ------------------------------------------------------------------ */

export function ComparateurCompareCard({
	plan,
	rembourse,
	resteACharge,
	isRecommended = false,
	isSelected = false,
}: {
	plan: OfferPlan;
	rembourse: number;
	resteACharge: number;
	isRecommended?: boolean;
	isSelected?: boolean;
}) {
	const total = rembourse + resteACharge;
	const percentage = total > 0 ? (rembourse / total) * 100 : 0;

	return (
		<div
			className={cn(
				"rounded-2xl px-5 py-4 w-full lg:px-6 lg:py-5",
				isRecommended ? "bg-[#490076]" : "bg-[#490076]/50",
			)}
		>
			{/* Title row */}
			<div className="flex items-baseline gap-2 mb-3">
				<p className="text-white font-bold text-lg leading-none lg:text-xl">
					{capitalize(plan)}
				</p>
				{isRecommended && (
					<span className="text-[11px] italic text-[#CE99FF]">
						Recommandé pour vous
					</span>
				)}
			</div>

			{/* Content row: image | texts | progress */}
			<div className="flex items-center gap-4">
				<div className="shrink-0">
					<Image
						src={
							isSelected
								? "/comparateur/comp-selected.svg"
								: "/comparateur/comp-not-selected.svg"
						}
						alt={isSelected ? "Sélectionné" : "Non sélectionné"}
						width={48}
						height={48}
						className="w-12 h-12"
					/>
				</div>

				<div className="flex-1 min-w-0 flex flex-col gap-1.5">
					<div className="flex items-baseline justify-between">
						<span className="text-sm font-bold text-white">
							Remboursé
						</span>
						<span className="text-base font-bold text-[#CE99FF]">
							{rembourse}€
						</span>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="text-xs text-white/70">
							Reste à charge
						</span>
						<span className="text-xs text-white font-medium">
							{resteACharge}€
						</span>
					</div>
				</div>

				<div className="shrink-0">
					<VerticalProgressBar percentage={percentage} height={64} />
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  ComparateurInfoCard                                                */
/* ------------------------------------------------------------------ */

export function ComparateurInfoCard({
	rembourse,
	resteACharge,
}: {
	rembourse: number;
	resteACharge: number;
}) {
	return (
		<div className="rounded-2xl border-2 border-[#490076] bg-[#25003C] px-5 py-4 w-full lg:px-6 lg:py-5 lg:flex lg:items-center">
			<div className="flex items-center gap-4 w-full">
				<div className="shrink-0">
					<Image
						src="/comparateur/folder.svg"
						alt="Dossier"
						width={44}
						height={44}
						className="w-11 h-11"
					/>
				</div>
				<div className="flex-1 min-w-0 flex flex-col gap-1.5">
					<div className="flex items-baseline justify-between">
						<span className="text-sm text-[#CE99FF]">
							Remboursé
						</span>
						<span className="text-base font-bold text-[#CE99FF]">
							{rembourse}€
						</span>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="text-xs text-[#CE99FF]">
							Reste à charge
						</span>
						<span className="text-sm font-bold text-white">
							{resteACharge}€
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  OfferSelectionTabs                                                 */
/* ------------------------------------------------------------------ */

export function OfferSelectionTabs({
	comparedOffer,
	onComparedOfferChange,
}: {
	comparedOffer: OfferPlan;
	onComparedOfferChange: (plan: OfferPlan) => void;
}) {
	const otherOffers = ALL_PLANS.filter((p) => p !== RECOMMENDED_OFFER);

	return (
		<Tabs
			value={comparedOffer}
			onValueChange={(val) => onComparedOfferChange(val as OfferPlan)}
			className="w-full lg:max-w-2xl lg:mx-auto"
		>
			<TabsList
				variant="essential"
				className="bg-[#CE99FF] p-1 gap-1"
			>
				{otherOffers.map((plan) => (
					<TabsTrigger
						key={plan}
						value={plan}
						variant="essential"
						className={cn(
							"gap-2 text-sm font-semibold lg:text-base lg:py-2.5",
							"text-[#F3E5FA] hover:bg-[#F3E5FA]/20",
							"data-active:bg-[#F3E5FA] data-active:text-[#490076]",
						)}
					>
						<span className="inline-flex items-center gap-2">
							{capitalize(plan)}
							<span
								className={cn(
									"inline-flex items-center justify-center size-5 rounded-full shrink-0 transition-colors",
									comparedOffer === plan
										? "bg-[#9000E3]"
										: "bg-[#290E67]/20",
								)}
							>
								{comparedOffer === plan && (
									<Check className="size-3 text-white" strokeWidth={3} />
								)}
							</span>
						</span>
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}

/* ------------------------------------------------------------------ */
/*  SectionDots                                                        */
/* ------------------------------------------------------------------ */

export function SectionDots({
	activeIndex,
	total,
	onDotClick,
}: {
	activeIndex: number;
	total: number;
	onDotClick: (index: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-3 py-2">
			{Array.from({ length: total }).map((_, i) => (
				<button
					key={i}
					type="button"
					onClick={() => onDotClick(i)}
					className={cn(
						"transition-all duration-200",
						i === activeIndex
							? "w-5 h-5"
							: "w-2 h-2 rounded-full bg-[#CE99FF]/40 hover:bg-[#CE99FF]/60",
					)}
				>
					{i === activeIndex ? (
						<Image
							src="/comparateur/diamond.svg"
							alt="Section active"
							width={20}
							height={20}
						/>
					) : null}
				</button>
			))}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  SectionCarousel                                                    */
/*  Carousel of section slides with dot sync                           */
/* ------------------------------------------------------------------ */

function CarouselDotSync({
	activeIndex,
	onIndexChange,
}: {
	activeIndex: number;
	onIndexChange: (index: number) => void;
}) {
	const { api } = useCarousel();

	useEffect(() => {
		if (!api) return;
		const onSelect = () => onIndexChange(api.selectedScrollSnap());
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onIndexChange]);

	useEffect(() => {
		if (!api) return;
		api.scrollTo(activeIndex);
	}, [api, activeIndex]);

	return null;
}

export function SectionCarousel({
	sections,
	activeIndex,
	onIndexChange,
	setApi,
	showArrows = false,
	onPlaceholderClick,
}: {
	sections: SectionMeta[];
	activeIndex: number;
	onIndexChange: (index: number) => void;
	setApi: (api: CarouselApi) => void;
	showArrows?: boolean;
	/** Called when the user taps the "Changer d'offre" placeholder slide. */
	onPlaceholderClick?: () => void;
}) {
	return (
		<Carousel
			opts={{ loop: false, align: "center" }}
			setApi={setApi}
			className="relative"
		>
			<CarouselContent>
				{sections.map((section) => (
					<CarouselItem key={section.key}>
						{section.key === "placeholder" ? (
							/* ── "Changer d'offre" slide ── */
							<button
								type="button"
								onClick={onPlaceholderClick}
								className="flex w-full flex-col items-center text-center px-6 group cursor-pointer"
							>
								<div className="flex items-center gap-2.5 mb-2">
									<Image
										src={section.icon}
										alt="Changer d'offre"
										width={24}
										height={24}
									/>
									<span className="text-[#E0B1FF] text-sm font-medium lg:text-base">
										Changer d{"'"}offre
									</span>
								</div>
								<p className="text-white font-bold text-base leading-snug lg:text-lg">
									Envie d{"'"}explorer une autre formule ?
								</p>
					
								<span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#9000E3] px-4 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-[#a020f0]">
									Changer d{"'"}offre
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="shrink-0"
									>
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								</span>
							</button>
						) : (
							/* ── Normal section slide ── */
							<div className="flex flex-col items-center text-center px-6">
								<div className="flex items-center gap-2.5 mb-2">
									<Image
										src={section.icon}
										alt={section.title}
										width={24}
										height={24}
									/>
									<span className="text-[#E0B1FF] text-sm font-medium lg:text-base">
										{section.title}
									</span>
								</div>
								<p className="text-white font-bold text-base leading-snug lg:text-lg">
									{section.subtitle}
								</p>
								<p className="mt-1.5 text-[#E0B1FF] text-xs leading-relaxed max-w-md lg:text-sm">
									{section.description}
								</p>
							</div>
						)}
					</CarouselItem>
				))}
			</CarouselContent>
			{showArrows && (
				<>
					<CarouselPrevious
						variant="ghost"
						className="left-0 border-0 bg-white/10 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
					/>
					<CarouselNext
						variant="ghost"
						className="right-0 border-0 bg-white/10 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
					/>
				</>
			)}
			<CarouselDotSync
				activeIndex={activeIndex}
				onIndexChange={onIndexChange}
			/>
		</Carousel>
	);
}
