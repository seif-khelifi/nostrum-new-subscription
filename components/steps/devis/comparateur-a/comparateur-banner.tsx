"use client";

import { AlertBanner } from "@/components/ui/alert";
import { capitalize, comparateurData } from "./data";

export function ComparateurBanner({
	selectedOffer,
	comparedOffer,
}: {
	selectedOffer: string;
	comparedOffer: string;
}) {
	const savingsAmount = comparateurData.banner.savingsAmount;

	return (
		<AlertBanner
			variant="comparateurDark"
			size="default"
			className="px-5 py-4 lg:px-6 lg:py-5"
			title={
				<span className="text-sm font-normal leading-relaxed text-white">
					Avec{" "}
					<span className="font-bold text-[#CE99FF]">
						{capitalize(selectedOffer)}
					</span>
					, vous économisez{" "}
					<span className="font-bold text-[#CE99FF]">
						{savingsAmount}
					</span>{" "}
					de plus qu{"'"}avec {capitalize(comparedOffer)} sur une seule
					couronne
				</span>
			}
			imageSrc="/garanties/illustration=Alert14.svg"
			imageAlt="Comparateur info"
		/>
	);
}
