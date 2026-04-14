import type { PlanPrices, VitaBeneficiary, VitaSessionStorage } from "@/types/subscription";
import { parseBirthdate, parsePrice } from "@/lib/utils";
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
	const birth = parseBirthdate(birthdate);
	if (!birth) return 0;
	return new Date().getFullYear() - birth.getFullYear();
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

/**
 * Ensure a price string is displayed as "XX,XX€".
 * Handles both already-formatted ("106,78€") and session-stored ("106.78") values.
 */
export function formatDisplayPrice(raw: string): string {
	if (raw.includes("€")) return raw;
	const num = parseFloat(raw);
	if (Number.isNaN(num)) return raw;
	return formatPrice(num);
}

/* ------------------------------------------------------------------ */
/*  Product pricing V3 (API)                                           */
/* ------------------------------------------------------------------ */

/** Shape returned by the product-pricing-v3 proxy. */
export interface ProductPricingResult {
	price: string;
	success: string;
	id: string;
	total_price_by_period: string[];
}

/** Format today's date as DD/MM/YYYY for the pricing API. */
function formatStartDate(): string {
	const d = new Date();
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yyyy = d.getFullYear();
	return `${dd}/${mm}/${yyyy}`;
}

/**
 * Extract the prorated price from the total_price_by_period array.
 * The array is 12 entries (one per month, 0-indexed from January).
 * The prorated price is the value at the current month's index,
 * converted from European comma format ("123,45") to a JS number.
 */
export function getProratedPrice(totalPriceByPeriod: string[]): number {
	const currentMonth = new Date().getMonth();
	const raw = String(totalPriceByPeriod[currentMonth] ?? "0");
	return Number(raw.replace(",", "."));
}

/** The PlanPrices keys in plan-index order (0=Découverte … 3=Gold). */
const PLAN_KEYS: (keyof PlanPrices)[] = ["Découverte", "Bronze", "Silver", "Gold"];

/**
 * Convert PlanPrices from display format ("54,23€") to session format ("54.23").
 */
function toSessionPlans(prices: PlanPrices): PlanPrices {
	return {
		"Découverte": String(parsePrice(prices["Découverte"])),
		Bronze: String(parsePrice(prices.Bronze)),
		Silver: String(parsePrice(prices.Silver)),
		Gold: String(parsePrice(prices.Gold)),
	};
}

/**
 * Call the product-pricing-v3 API for a given plan and return the
 * session patch (plans, TV3price, prorated_price, selectedPlan,
 * and beneficiaries with productId assigned).
 */
export async function fetchProductPricing(
	beneficiaries: VitaBeneficiary[],
	selectedPlan: number,
	plans: PlanPrices,
): Promise<Partial<VitaSessionStorage>> {
	const res = await fetch("/api/pricing", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			beneficiaries: beneficiaries.map(({ birthdate, relationship }) => ({
				birthdate: birthdate || "01/01/2023",
				relationship,
			})),
			startDate: formatStartDate(),
			selectedPlan,
		}),
	});
	const data = await res.json();
	if (data.error) throw new Error(data.error);

	const result = (data as ProductPricingResult[])[0];

	const proratedPrice = getProratedPrice(result.total_price_by_period);

	// Convert plans from display format ("54,23€") to session format ("54.23")
	const sessionPlans = toSessionPlans(plans);

	// TV3price = the selected plan's price in dot notation
	const tv3Price = sessionPlans[PLAN_KEYS[selectedPlan]];

	// Assign productId to all beneficiaries
	const updatedBeneficiaries = beneficiaries.map((b) => ({
		...b,
		productId: result.id,
	}));

	return {
		beneficiaries: updatedBeneficiaries,
		plans: sessionPlans,
		TV3price: tv3Price,
		prorated_price: proratedPrice,
		selectedPlan,
	};
}
