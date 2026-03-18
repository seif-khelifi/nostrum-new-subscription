/* ─── Option value literals ─── */

export type ProfilValue =
	| "salarie"
	| "independant_tns"
	| "etudiant"
	| "independant"
	| "retraite"
	| "recherche_emploi";

export type SexeValue = "homme" | "femme" | "autre";

export type ProtegerValue = "moi" | "conjoint_et_moi" | "enfants_et_moi" | "famille";

export type CommenceParQuiValue = "conjoint" | "enfant";

export type ResilierMutuelleValue = "pas_de_mutuelle" | "mutuelle_a_resilier";

/* ─── Nested structures for family members ─── */

export interface ConjointInfo {
	/** Spouse's date of birth (ISO string or date input value) */
	birthDate: string;
}

export interface EnfantInfo {
	/** Child's date of birth */
	birthDate: string;
}

/* ─── Root form data ─── */

export interface SituationFormData {
	/* ── profil step ── */
	profil: ProfilValue | null;

	/* ── personalInfo step ── */
	firstName: string;
	lastName: string;
	birthDate: string;

	/* ── mail step ── */
	email: string;

	/* ── phoneNumber step ── */
	phone: string;

	/* ── sexe step ── */
	sexe: SexeValue | null;

	/* ── proteger step ── */
	proteger: ProtegerValue | null;

	/* ── nousSommes step ── */
	familyCount: number | null;

	/* ── commenceParQui step ── */
	commenceParQui: CommenceParQuiValue | null;

	/* ── Conjoint (spouse) ── */
	conjoint: ConjointInfo | null;

	/* ── Children ── */
	enfants: EnfantInfo[];

	/* ── address step ── */
	addressStreet: string;
	addressComplement: string;
	addressPostalCode: string;
	addressCity: string;

	/* ── birthPlace step ── */
	birthCountry: string;
	birthCity: string;

	/* ── socialSecurity step ── */
	socialSecurityNumber: string;

	/* ── resilierMutuelle step ── */
	resilierMutuelle: ResilierMutuelleValue | null;

	/* ── currentInsurance step ── */
	currentInsuranceName: string;
	currentInsuranceStreet: string;
	currentInsuranceComplement: string;
	currentInsurancePostalCode: string;
	currentInsuranceCity: string;

	/* ── dateSignatureAncien step ── */
	dateSignatureAncienContrat: string;

	/* ── dateDebutNostrum step ── */
	dateDebutContratNostrum: string;
}

/* ─── Initial / empty state ─── */

export const INITIAL_SITUATION: SituationFormData = {
	profil: null,
	firstName: "",
	lastName: "",
	birthDate: "",
	email: "",
	phone: "",
	sexe: null,
	proteger: null,
	familyCount: null,
	commenceParQui: null,
	conjoint: null,
	enfants: [],
	addressStreet: "",
	addressComplement: "",
	addressPostalCode: "",
	addressCity: "",
	birthCountry: "",
	birthCity: "",
	socialSecurityNumber: "",
	resilierMutuelle: null,
	currentInsuranceName: "",
	currentInsuranceStreet: "",
	currentInsuranceComplement: "",
	currentInsurancePostalCode: "",
	currentInsuranceCity: "",
	dateSignatureAncienContrat: "",
	dateDebutContratNostrum: "",
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  Santé (Health) form data                                         */
/* ═══════════════════════════════════════════════════════════════════ */

export type YeuxValue = "rien" | "lunettes_lentilles" | "specifique";

export type DentsValue = "routine" | "soins_reguliers" | "soins_specifiques";

export type BienEtreValue = "classiques" | "medecines_douces" | "routine_complete";

export interface SanteFormData {
	yeux: YeuxValue | null;
	dents: DentsValue | null;
	bienEtre: BienEtreValue | null;
}

export const INITIAL_SANTE: SanteFormData = {
	yeux: null,
	dents: null,
	bienEtre: null,
};
