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
