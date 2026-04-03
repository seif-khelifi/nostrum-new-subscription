import comparateurData from "@/data/comparateur-variant-a.json";
import offersData from "@/data/offers.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type OfferPlan = "decouverte" | "bronze" | "silver" | "gold";

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
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const ALL_PLANS: OfferPlan[] = [
	"decouverte",
	"bronze",
	"silver",
	"gold",
];

export const capitalize = (s: string) =>
	s.charAt(0).toUpperCase() + s.slice(1);

export const RECOMMENDED_OFFER: OfferPlan =
	(offersData.offers.find((o) => o.tone === "recommended")
		?.plan as OfferPlan) ?? "silver";

export const sections: SectionMeta[] =
	comparateurData.sections as SectionMeta[];

export const compareData = comparateurData.compareData as Record<
	string,
	Record<string, CompareValues>
>;

export const infoCardData = comparateurData.infoCard as Record<
	string,
	CompareValues
>;

export { comparateurData };
