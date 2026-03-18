import { z } from "zod/v3";

/* ─── Helpers ─── */

/** Returns the age in full years for a given date. */
function ageFromDate(date: Date): number {
	const today = new Date();
	let age = today.getFullYear() - date.getFullYear();
	const monthDiff = today.getMonth() - date.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
		age--;
	}
	return age;
}

/** Zod refinement: date must represent someone aged between `min` and `max` years. */
const birthDateSchema = (min: number, max: number) =>
	z
		.date({ invalid_type_error: "Veuillez sélectionner une date" })
		.refine((d) => ageFromDate(d) >= min, {
			message: `L'âge minimum est de ${min} ans`,
		})
		.refine((d) => ageFromDate(d) <= max, {
			message: `L'âge maximum est de ${max} ans`,
		});

/* ─── Step schemas ─── */

/** personalInfo step — firstName, lastName, birthDate */
export const personalInfoSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, "Le prénom est requis")
		.min(2, "Le prénom doit contenir au moins 2 caractères"),
	lastName: z
		.string()
		.trim()
		.min(1, "Le nom est requis")
		.min(2, "Le nom doit contenir au moins 2 caractères"),
	birthDate: birthDateSchema(19, 95),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

/** dateBirthConjoint step — conjoint's birthDate */
export const dateBirthConjointSchema = z.object({
	conjointBirthDate: birthDateSchema(19, 95),
});

export type DateBirthConjointFormValues = z.infer<typeof dateBirthConjointSchema>;

/** phoneNumber step — French phone number */
export const phoneNumberSchema = z.object({
	phone: z
		.string()
		.trim()
		.min(1, "Le numéro de téléphone est requis")
		.regex(
			/^(?:0|\+33|0033)[1-9](?:[\s.-]?\d{2}){4}$/,
			"Veuillez entrer un numéro de téléphone français valide (ex: 06 12 34 56 78)",
		),
});

export type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

/** mail step — email address */
export const mailSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "L'adresse email est requise")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Veuillez entrer une adresse email valide",
		),
});

export type MailFormValues = z.infer<typeof mailSchema>;

/** recap step — confirm all personal info (phone editable) */
export const recapSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, "Le prénom est requis")
		.min(2, "Le prénom doit contenir au moins 2 caractères"),
	lastName: z
		.string()
		.trim()
		.min(1, "Le nom est requis")
		.min(2, "Le nom doit contenir au moins 2 caractères"),
	birthDate: birthDateSchema(19, 95),
	email: z
		.string()
		.trim()
		.min(1, "L'adresse email est requise")
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Veuillez entrer une adresse email valide",
		),
	phone: z
		.string()
		.trim()
		.min(1, "Le numéro de téléphone est requis")
		.regex(
			/^(?:0|\+33|0033)[1-9](?:[\s.-]?\d{2}){4}$/,
			"Veuillez entrer un numéro de téléphone français valide (ex: 06 12 34 56 78)",
		),
});

export type RecapFormValues = z.infer<typeof recapSchema>;

/** envoiSms step — OTP code (6 digits) */
export const otpSchema = z.object({
	otp: z
		.string()
		.length(6, "Le code doit contenir 6 chiffres")
		.regex(/^\d{6}$/, "Le code ne doit contenir que des chiffres"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

/** birthPlace step — birth country + city */
export const birthPlaceSchema = z.object({
	birthCountry: z
		.string()
		.trim()
		.min(1, "Le pays de naissance est requis"),
	birthCity: z
		.string()
		.trim()
		.min(1, "La ville de naissance est requise"),
});

export type BirthPlaceFormValues = z.infer<typeof birthPlaceSchema>;

/** address step — manual address entry */
export const addressSchema = z.object({
	street: z
		.string()
		.trim()
		.min(1, "Le numéro et la voie sont requis"),
	complement: z
		.string()
		.trim()
		.optional()
		.or(z.literal("")),
	postalCode: z
		.string()
		.trim()
		.min(1, "Le code postal est requis")
		.regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
	city: z
		.string()
		.trim()
		.min(1, "La ville est requise"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

/** socialSecurity step — French social security number (15 digits with key check) */
export const socialSecuritySchema = z.object({
	socialSecurityNumber: z
		.string()
		.trim()
		.min(1, "Le numéro de sécurité sociale est requis")
		.transform((val) => val.replace(/\s/g, ""))
		.pipe(
			z
				.string()
				.regex(/^\d{15}$/, "Le numéro doit contenir exactement 15 chiffres")
				.refine(
					(val) => {
						const base = parseInt(val.slice(0, 13), 10);
						const key = parseInt(val.slice(13, 15), 10);
						return key === 97 - (base % 97);
					},
					{ message: "La clé de contrôle du numéro de sécurité sociale est invalide" },
				),
		),
});

export type SocialSecurityFormValues = z.infer<typeof socialSecuritySchema>;

/** currentInsurance step — current insurance name + address */
export const currentInsuranceSchema = z.object({
	insuranceName: z
		.string()
		.trim()
		.min(1, "Le nom de la mutuelle est requis"),
	street: z
		.string()
		.trim()
		.min(1, "Le numéro et la voie sont requis"),
	complement: z
		.string()
		.trim()
		.optional()
		.or(z.literal("")),
	postalCode: z
		.string()
		.trim()
		.min(1, "Le code postal est requis")
		.regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
	city: z
		.string()
		.trim()
		.min(1, "La ville est requise"),
});

export type CurrentInsuranceFormValues = z.infer<typeof currentInsuranceSchema>;

/** dateSignatureAncien step — date of old contract signature */
export const dateSignatureAncienSchema = z.object({
	dateSignature: z.date({ invalid_type_error: "Veuillez sélectionner une date" }),
});

export type DateSignatureAncienFormValues = z.infer<typeof dateSignatureAncienSchema>;

/** dateDebutNostrum step — desired start date for Nostrum contract */
export const dateDebutNostrumSchema = z.object({
	dateDebut: z.date({ invalid_type_error: "Veuillez sélectionner une date" }),
});

export type DateDebutNostrumFormValues = z.infer<typeof dateDebutNostrumSchema>;
