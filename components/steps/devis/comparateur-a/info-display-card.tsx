"use client";

import Image from "next/image";
import { type OfferPlan, infoCardData } from "./data";

export function InfoDisplayCard({ plan }: { plan: OfferPlan }) {
	const data = infoCardData[plan] ?? { rembourse: 0, resteACharge: 0 };

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
							{data.rembourse}€
						</span>
					</div>
					<div className="flex items-baseline justify-between">
						<span className="text-xs text-[#CE99FF]">
							Reste à charge
						</span>
						<span className="text-sm font-bold text-white">
							{data.resteACharge}€
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
