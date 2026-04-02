import type { VariantConfig } from "./types";

/**
 * Variant B — alternative experience.
 *
 * Start by copying variant A's structure, then override the fields
 * you want to differ. Only the overridden keys will change;
 * components fall back to their hardcoded defaults for anything
 * not specified here.
 *
 * TODO: Customize step groups, texts, and banners for variant B.
 *       For now this is identical to variant A so the app works
 *       out of the box with either variant.
 */
export const variantB: VariantConfig = {
  id: "b",

  /* ────────────────────────────────────────────────────────────── */
  /*  Step groups & ordering                                       */
  /*  Override this to reorder, add, or remove steps in variant B  */
  /* ────────────────────────────────────────────────────────────── */

  stepGroups: [
    {
      id: 1,
      label: "Onboarding",
      steps: [{ id: "onboarding", label: "Onboarding" }],
    },
    {
      id: 2,
      label: "Situation",
      steps: [
        { id: "profil", label: "Profil" },
        { id: "personalInfo", label: "Informations personnelles" },
        { id: "mail", label: "Adresse e-mail" },
        { id: "phoneNumber", label: "Numéro de téléphone" },
        { id: "proteger", label: "Protection" },
        { id: "nousSommes", label: "Nous sommes" },
        { id: "commenceParQui", label: "On commence par qui" },
        { id: "dateBirthConjoint", label: "Date de naissance conjoint" },
      ],
    },
    {
      id: 3,
      label: "Santé",
      steps: [
        { id: "sante_yeux", label: "Yeux" },
        { id: "sante_dents", label: "Dents" },
        { id: "sante_bien_etre", label: "Bien-être" },
      ],
    },
    {
      id: 4,
      label: "Transition",
      steps: [{ id: "transition_offer", label: "Offre de transition" }],
    },
    {
      id: 5,
      label: "Devis",
      steps: [
        { id: "devis_placeholder", label: "Devis" },
        { id: "garanties", label: "Garanties" },
        { id: "offre_comparateur", label: "Offre Comparateur" },
        { id: "options", label: "Options" },
      ],
    },
    {
      id: 6,
      label: "Souscription",
      steps: [
        { id: "sexe", label: "Sexe" },
        { id: "recap", label: "Récapitulatif" },
        { id: "envoiSms", label: "Vérification SMS" },
        { id: "address", label: "Adresse postale" },
        { id: "birthPlace", label: "Lieu de naissance" },
        { id: "socialSecurity", label: "Sécurité sociale" },
        { id: "resilierMutuelle", label: "Résilier mutuelle" },
        { id: "currentInsurance", label: "Mutuelle actuelle" },
        { id: "dateSignatureAncien", label: "Date signature ancien contrat" },
        { id: "dateDebutNostrum", label: "Date début contrat Nostrum" },
        { id: "souscription_placeholder", label: "Souscription" },
      ],
    },
  ],

  /* ────────────────────────────────────────────────────────────── */
  /*  Per-step texts                                               */
  /*  Override only the steps whose text should differ from A.     */
  /*  Omitted steps will use the component's hardcoded defaults.   */
  /* ────────────────────────────────────────────────────────────── */

  texts: {
    profil: {
      title: "Quel est votre statut professionnel ?",
      options: [
        { value: "salarie", label: "Salarié(e)" },
        { value: "independant_tns", label: "Indépendant(e) /TNS" },
        { value: "etudiant", label: "Étudiant(e)" },
        { value: "independant", label: "Indépendant(e)" },
        { value: "retraite", label: "Retraité(e)" },
        { value: "recherche_emploi", label: "En recherche d'emploi" },
      ],
    },

    sante_yeux: {
      title: "Parlons de vos yeux",
      banner: {
        variant: "info",
        title: "Nostrum Care rembourse plus de 40 médecines douces",
        subtitle: "ostéopathie, sophrologie, psychologie...",
        icon: true,
      },
    },

    // Explicitly remove a banner that variant A has:
    phoneNumber: {
      title: "Et pour vous contacter ?",
      banner: null,
    },
  },
};
