import type { PlanPrices } from "@/types/subscription";
import pricingTable from "@/data/pricing.json";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CONTRIBUTION_2025 = 3.7;
const ADDITIONAL_FEES = 2.09;

/** The pricing table keyed by age (as string). */
const pricing = pricingTable as Record<string, Record<string, number>>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Calculate a person's age from their birthdate string.
 * Uses year-based calculation (current year minus birth year)
 * to match the original pricing engine behaviour.
 */
function calculateAge(birthdate: string): number {
	const birth = new Date(birthdate);
	const today = new Date();
	return today.getFullYear() - birth.getFullYear();
}

/** Clamp an age to the range available in the pricing table (19–95). */
function clampAge(age: number): number {
	if (age <= 19) return 19;
	if (age >= 95) return 95;
	return age;
}

/* ------------------------------------------------------------------ */
/*  Main pricing function                                              */
/* ------------------------------------------------------------------ */

interface Beneficiary {
	birthdate: string;
	relationship: string;
	startDate?: string;
}

/**
 * Calculate cumulative plan prices for a list of beneficiaries.
 *
 * For each beneficiary, their age is resolved against the pricing table
 * and per-plan fees (ADDITIONAL_FEES) are added. After summing all
 * beneficiaries, the CONTRIBUTION_2025 is added once per plan.
 *
 * Returns a `PlanPrices` object with French-formatted price strings
 * (e.g. "54,23€").
 */
export function getPricing(beneficiaries: Beneficiary[]): PlanPrices {
	const cumulative: Record<string, number> = {};

	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();
	const startDate = (beneficiaries[0] as Beneficiary & { startDate?: string })?.startDate;

	for (const beneficiary of beneficiaries) {
		let age: number;

		if (!beneficiary.birthdate) {
			// No birthdate provided — default to youngest bracket (age 19)
			age = 0;
		} else {
			age = calculateAge(beneficiary.birthdate);

			// If we're in December or the start date is next year, add 1 to age
			if (
				currentMonth === 11 ||
				(startDate && parseInt(startDate.split("/")[2]) > currentYear)
			) {
				age += 1;
			}
		}

		const row = pricing[String(clampAge(age))];
		if (!row) continue;

		for (const [plan, basePrice] of Object.entries(row)) {
			cumulative[plan] = (cumulative[plan] ?? 0) + basePrice + ADDITIONAL_FEES;
		}
	}

	// Add the flat contribution once per plan and format
	for (const plan of Object.keys(cumulative)) {
		cumulative[plan] = parseFloat((cumulative[plan] + CONTRIBUTION_2025).toFixed(2));
	}

	return {
		"Découverte": formatPrice(cumulative["Découverte"] ?? 0),
		Bronze: formatPrice(cumulative["Bronze"] ?? 0),
		Silver: formatPrice(cumulative["Silver"] ?? 0),
		Gold: formatPrice(cumulative["Gold"] ?? 0),
	};
}

/* ------------------------------------------------------------------ */
/*  Plan-id → PlanPrices key mapping                                   */
/* ------------------------------------------------------------------ */

/** Map lowercase plan ids to the accented keys used in pricing.json / PlanPrices. */
const PLAN_KEY_MAP: Record<string, keyof PlanPrices> = {
	decouverte: "Découverte",
	bronze: "Bronze",
	silver: "Silver",
	gold: "Gold",
};

/** Get the calculated price string for a single plan id (e.g. "silver" → "60,26€"). */
export function priceForPlan(prices: PlanPrices, planId: string): string {
	const key = PLAN_KEY_MAP[planId];
	return key ? prices[key] : "0,00€";
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

/** Format a number as a French price string (e.g. "38,06€"). */
function formatPrice(n: number): string {
	return n.toFixed(2).replace(".", ",") + "€";
}
