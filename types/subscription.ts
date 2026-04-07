/* ═══════════════════════════════════════════════════════════════════ */
/*  UI-only types (navigation & duty-of-care, NOT sent to DB)         */
/* ═══════════════════════════════════════════════════════════════════ */

export type ProtegerValue = "moi" | "conjoint_et_moi" | "enfants_et_moi" | "famille";
export type CommenceParQuiValue = "conjoint" | "enfant";
export type ResilierMutuelleValue = "pas_de_mutuelle" | "mutuelle_a_resilier";
export type SexeValue = "homme" | "femme" | "autre";
export type YeuxValue = "rien" | "lunettes_lentilles" | "specifique";
export type DentsValue = "routine" | "soins_reguliers" | "soins_specifiques";
export type BienEtreValue = "classiques" | "medecines_douces" | "routine_complete";

/** Stored in sessionStorage["subscription_ui"] — drives navigation & santé answers */
export interface SubscriptionUIData {
	proteger: ProtegerValue | null;
	familyCount: number | null;
	commenceParQui: CommenceParQuiValue | null;
	resilierMutuelle: ResilierMutuelleValue | null;
	yeux: YeuxValue | null;
	dents: DentsValue | null;
	bienEtre: BienEtreValue | null;
}

export const INITIAL_UI: SubscriptionUIData = {
	proteger: null,
	familyCount: null,
	commenceParQui: null,
	resilierMutuelle: null,
	yeux: null,
	dents: null,
	bienEtre: null,
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  Vita Session Storage — the DB-bound shape                         */
/*  Stored in sessionStorage["session"]                               */
/* ═══════════════════════════════════════════════════════════════════ */

// ── Enums ──

export type ProfileType =
	| "EMPLOYEE"
	| "SELF_EMPLOYED"
	| "STUDENT"
	| "PARENT_AT_HOME"
	| "FONCTIONARY"
	| "INTERIM_WORKER"
	| "RETIRED"
	| "PRACTITIONER"
	| "BUSINESS_OWNER"
	| "JOB_SEEKER"
	| "OTHER";

export type BeneficiaryRelationship = "PRIMARY_SUBSCRIBER" | "MARRIED" | "CHILDREN";
export type RegimeType = "AS" | "TNS" | "ALSACE_MOSELLE" | "OTHER";
export type HealthPriority = "teeth" | "eyes" | "hospitalization" | "alt_medicine" | "generalists_and_specialists";
export type ConsultationFrequency = "0_5_per_year" | "5_10_per_year" | "10_plus_per_year";
export type Gender = "M" | "F";

// ── Per-step beneficiary data ──

export interface SimulationData {
	firstname: string;
	lastname: string;
	email: string;
	birthdate: string;
	phone: string;
	relationship: BeneficiaryRelationship;
	quel_est_votre_profil_: ProfileType;
	opt_in_webapp_vita: boolean;
	utm_campaign?: string;
	utm_source?: string;
	utm_medium?: string;
}

export interface DutyOfCareData {
	health_priorities: HealthPriority;
	consultation_frequency: ConsultationFrequency;
}

export interface PlanAssignment {
	productId: string;
}

export interface MainBeneficiaryInfoData {
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	birthdate: string;
	gender: Gender;
	birth_place: string;
	birth_country: string;
	birth_department_number: string;
	gdprConsent: boolean;
	address_number?: string;
	address_street_name?: string;
	address_city?: string;
	address_zip?: string;
	address_country?: string;
	address_additionnal?: string;
}

export interface InsuranceAndSsnData {
	socialWelfareNumber: string;
	regimeType: RegimeType;
	startDate: string;
	previousMutualTermination: boolean;
	previousHealthMutualAddress: string;
	previousHealthMutualName?: string;
	previousContractStartDate?: string;
	previousContractEndDate?: string;
	previousContractEndDateAsked?: string;
}

export interface BeneficiaryIdData {
	beneficiaryId: string;
}

// ── Composed beneficiary types ──

export interface PrimaryBeneficiary
	extends SimulationData,
		DutyOfCareData,
		PlanAssignment,
		MainBeneficiaryInfoData,
		InsuranceAndSsnData,
		BeneficiaryIdData {
	relationship: "PRIMARY_SUBSCRIBER";
	sexe?: SexeValue;
}

export interface SecondaryBeneficiary
	extends PlanAssignment,
		InsuranceAndSsnData,
		BeneficiaryIdData {
	relationship: "MARRIED" | "CHILDREN";
	gender: Gender;
	firstname: string;
	lastname: string;
	birthdate: string;
	phone: string;
	email?: string;
}

export type VitaBeneficiary = PrimaryBeneficiary | SecondaryBeneficiary;

// ── User ──

export interface UserContract {
	id: string;
	price: number;
	medium: string;
	old_id: string;
	source: string;
	status: string;
	channel: string | null;
	product: {
		id: string;
		name: string;
		type: string;
		image: string | null;
		level: number;
		caption: string;
		insurer: string;
		category: string;
		universe: string;
		stripe_id: string;
		created_at: string;
		updated_at: string;
		tv3_product_id: string[];
	};
	user_id: string;
	campaign: string | null;
	coupon_id: string | null;
	frequency: string;
	created_at: string;
	is_madelin: boolean;
	onespan_id: string;
	partner_id: string | null;
	product_id: string;
	start_date: string;
	updated_at: string;
	closed_date: string | null;
	advantage_link: string;
	prorated_price: number | null;
	signature_date: string;
	pv3_external_id: string;
	tv3_contract_id: string;
	tv3_external_id: string | null;
	contract_pdf_url: string;
	pv3_callback_url: string;
	tv3_quotation_id: string | null;
	onboarding_status: string;
	insurance_cancel_id: string | null;
	psp_subscription_id: string;
	list_beneficiaries_id: string[];
	teletransmission_status: string | null;
}

export interface SessionUser {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	phone_number: string;
	status: string;
	blocked_reason: string | null;
	tv3_adherent_id: string;
	created_at: string;
	updated_at: string;
	psp_customer_id: string;
	pin_code: string | null;
	psp_payment_method_id: string | null;
	list_contracts_id: string[];
	discovery_process: string;
	old_id: string;
	hubspot_id: string | null;
	opt_in_webapp_vita: boolean | null;
	contract: UserContract[];
	address_number?: string;
	address_street_name?: string;
	address_city?: string;
	address_zip?: string;
	address_country?: string;
	address_additionnal?: string;
}

// ── Plan pricing ──

export interface PlanPrices {
	Découverte: string;
	Bronze: string;
	Silver: string;
	Gold: string;
}

// ── Top-level session ──

export interface VitaSessionStorage {
	beneficiaries: VitaBeneficiary[];
	plans: PlanPrices | null;
	selectedPlan: number | null;
	TV3price?: string;
	prorated_price?: number;
	user?: SessionUser;
	paymentMethodId?: string;
	paymentMethodType?: "card" | "sepa_debit";
	contract?: {
		rk_OneSpanContractURL: string;
		id: string;
	};
}

export const INITIAL_VITA_SESSION: VitaSessionStorage = {
	beneficiaries: [],
	plans: null,
	selectedPlan: null,
};
