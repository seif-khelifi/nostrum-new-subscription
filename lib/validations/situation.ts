import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

/* ═══════════════════════════════════════════════════════════════════ */
/*  Helpers                                                           */
/* ═══════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════ */
/*  Reusable field schemas                                            */
/* ═══════════════════════════════════════════════════════════════════ */

/** Zod refinement: date must represent someone aged between `min` and `max` years. */
const birthDateSchema = (min: number, max: number) =>
  z
    .date({ error: "Veuillez sélectionner une date" })
    .refine((d) => ageFromDate(d) >= min, {
      message: `L'âge minimum est de ${min} ans`,
    })
    .refine((d) => ageFromDate(d) <= max, {
      message: `L'âge maximum est de ${max} ans`,
    });

const firstNameField = z
  .string()
  .trim()
  .min(1, "Le prénom est requis")
  .min(2, "Le prénom doit contenir au moins 2 caractères");

const lastNameField = z
  .string()
  .trim()
  .min(1, "Le nom est requis")
  .min(2, "Le nom doit contenir au moins 2 caractères");

const emailField = z
  .string()
  .trim()
  .min(1, "L'adresse email est requise")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Veuillez entrer une adresse email valide",
  );

const phoneField = z
  .string()
  .trim()
  .min(1, "Le numéro de téléphone est requis")
  .refine(
    (value) => {
      if (!value) return false;
      return isValidPhoneNumber(value);
    },
    { message: "Veuillez entrer un numéro de téléphone valide" },
  );

const postalCodeField = z
  .string()
  .trim()
  .min(1, "Le code postal est requis")
  .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres");

const streetField = z
  .string()
  .trim()
  .min(1, "Le numéro et la voie sont requis");
const complementField = z.string().trim().optional().or(z.literal(""));
const cityField = z.string().trim().min(1, "La ville est requise");

/** Reusable address shape (street, complement, postalCode, city). */
const addressFields = {
  street: streetField,
  complement: complementField,
  postalCode: postalCodeField,
  city: cityField,
} as const;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Situation step schemas                                            */
/* ═══════════════════════════════════════════════════════════════════ */

/** personalInfo step — firstName, lastName, birthDate */
export const personalInfoSchema = z.object({
  firstName: firstNameField,
  lastName: lastNameField,
  birthDate: birthDateSchema(19, 95),
});
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

/** dateBirthConjoint step — conjoint's birthDate */
export const dateBirthConjointSchema = z.object({
  conjointBirthDate: birthDateSchema(19, 95),
});
export type DateBirthConjointFormValues = z.infer<
  typeof dateBirthConjointSchema
>;

/** nousSommes step — family member count (minimum 2) */
export const nousSommesSchema = z.object({
  familyCount: z.coerce
    .number({ error: "Veuillez entrer un nombre" })
    .int("Veuillez entrer un nombre entier")
    .min(2, "Le nombre minimum est de 2 personnes"),
});
export type NousSommesFormValues = z.infer<typeof nousSommesSchema>;

/** phoneNumber step */
export const phoneNumberSchema = z.object({
  phone: phoneField,
});
export type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

/** mail step */
export const mailSchema = z.object({
  email: emailField,
});
export type MailFormValues = z.infer<typeof mailSchema>;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Souscription step schemas                                         */
/* ═══════════════════════════════════════════════════════════════════ */

/** recap step — confirm all personal info (phone editable) */
export const recapSchema = z.object({
  firstName: firstNameField,
  lastName: lastNameField,
  birthDate: birthDateSchema(19, 95),
  email: emailField,
  phone: phoneField,
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
  birthCountry: z.string().trim().min(1, "Le pays de naissance est requis"),
  birthCity: z.string().trim().min(1, "La ville de naissance est requise"),
});
export type BirthPlaceFormValues = z.infer<typeof birthPlaceSchema>;

/** address step — manual address entry */
export const addressSchema = z.object(addressFields);
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
          {
            message:
              "La clé de contrôle du numéro de sécurité sociale est invalide",
          },
        ),
    ),
});
export type SocialSecurityFormValues = z.infer<typeof socialSecuritySchema>;

/** currentInsurance step — current insurance name + address */
export const currentInsuranceSchema = z.object({
  insuranceName: z.string().trim().min(1, "Le nom de la mutuelle est requis"),
  ...addressFields,
});
export type CurrentInsuranceFormValues = z.infer<typeof currentInsuranceSchema>;

/** dateSignatureAncien step — date of old contract signature */
export const dateSignatureAncienSchema = z.object({
  dateSignature: z.date({ error: "Veuillez sélectionner une date" }),
});
export type DateSignatureAncienFormValues = z.infer<
  typeof dateSignatureAncienSchema
>;

/** dateDebutNostrum step — desired start date for Nostrum contract */
export const dateDebutNostrumSchema = z.object({
  dateDebut: z.date({ error: "Veuillez sélectionner une date" }),
});
export type DateDebutNostrumFormValues = z.infer<typeof dateDebutNostrumSchema>;
