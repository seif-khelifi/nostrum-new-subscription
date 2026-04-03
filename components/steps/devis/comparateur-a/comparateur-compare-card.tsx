"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { type OfferPlan, capitalize, compareData } from "./data";

/* ------------------------------------------------------------------ */
/*  Vertical Progress Bar (internal to compare card)                   */
/* ------------------------------------------------------------------ */

function VerticalProgressBar({
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
/*  Compare Card                                                       */
/* ------------------------------------------------------------------ */

export function ComparateurCompareCard({
	plan,
	sectionKey,
	isRecommended = false,
	isSelected = false,
}: {
	plan: OfferPlan;
	sectionKey: string;
	isRecommended?: boolean;
	isSelected?: boolean;
}) {
	const planData = compareData[plan]?.[sectionKey] ?? {
		rembourse: 0,
		resteACharge: 0,
	};
	const total = planData.rembourse + planData.resteACharge;
	const percentage = total > 0 ? (planData.rembourse / total) * 100 : 0;

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

			{/* Content row: image | texts | progress — all horizontal */}
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
							{planData.rembourse}€
						</span>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="text-xs text-white/70">
							Reste à charge
						</span>
						<span className="text-xs text-white font-medium">
							{planData.resteACharge}€
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
