import type { VariantConfig } from "./types";

/**
 * Variant A — the current/default experience.
 *
 * This config is the single source of truth for all user-facing copy,
 * step ordering, banners, and options. Step components read directly
 * from here and must never hardcode fallback text.
 */
export const variantA: VariantConfig = {
  id: "a",

  /* ────────────────────────────────────────────────────────────── */
  /*  Step groups & ordering                                       */
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
  /*  Skip rules — conditional step routing                        */
  /* ────────────────────────────────────────────────────────────── */

  skipRules: [
    // "Seulement moi" → skip family steps, jump to santé
    { from: "proteger", field: "proteger", value: "moi", target: "sante_yeux" },
    // "Mon enfant" → skip dateBirthConjoint, jump to santé
    {
      from: "commenceParQui",
      field: "commenceParQui",
      value: "enfant",
      target: "sante_yeux",
    },
    // "Pas de mutuelle" → skip currentInsurance + dateSignatureAncien
    {
      from: "resilierMutuelle",
      field: "resilierMutuelle",
      value: "pas_de_mutuelle",
      target: "dateDebutNostrum",
    },
  ],

  /* ────────────────────────────────────────────────────────────── */
  /*  Per-step texts                                               */
  /* ────────────────────────────────────────────────────────────── */

  texts: {
    /* ── Situation ── */

    profil: {
      title: "Votre situation pro ?",
      options: [
        { value: "salarie", label: "Salarié(e)" },
        { value: "independant_tns", label: "Indépendant(e) /TNS" },
        { value: "etudiant", label: "Étudiant(e)" },
        { value: "independant", label: "Indépendant(e)" },
        { value: "retraite", label: "Retraité(e)" },
        { value: "recherche_emploi", label: "En recherche d'emploi" },
      ],
    },

    personalInfo: {
      title: "Dites-nous qui vous êtes ?",
    },

    mail: {
      title: "Et pour vous contacter ?",
    },

    phoneNumber: {
      title: "Et pour vous contacter ?",
      banner: {
        variant: "info",
        title:
          "Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone.",
        subtitle:
          "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
        icon: true,
      },
    },

    proteger: {
      title: "Qui souhaitez-vous protéger ?",
      options: [
        { value: "moi", label: "Seulement moi" },
        { value: "conjoint_et_moi", label: "Mon conjoint(e) et moi" },
        { value: "enfants_et_moi", label: "Mes enfants et moi" },
        { value: "famille", label: "Toute ma famille" },
      ],
    },

    nousSommes: {
      title: "Qui souhaitez-vous protéger ?",
    },

    commenceParQui: {
      title: "On commence par qui ?",
      options: [
        { value: "conjoint", label: "Mon conjoint(e)" },
        { value: "enfant", label: "Mon enfant" },
      ],
    },

    dateBirthConjoint: {
      title: "On commence par qui ?",
      banner: {
        variant: "info",
        title:
          "Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone.",
        subtitle:
          "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
        icon: true,
      },
    },

    /* ── Santé ── */

    sante_yeux: {
      title: "On commence par vos yeux ?",
      options: [
        { value: "rien", label: "Je n'ai besoin de rien" },
        {
          value: "lunettes_lentilles",
          label: "Je porte des lunettes ou des lentilles",
        },
        {
          value: "specifique",
          label: "J'ai besoin de solutions plus spécifiques",
        },
      ],
      banner: {
        variant: "info",
        title: "On vous répond comme vous préférez.",
        subtitle:
          "Un conseiller reprend votre demande et vous contacte dans le canal choisi pour vous guider.",
        imageSrc: "/alertBanner/speaker.svg",
        imageAlt: "Speaker",
      },
    },

    sante_dents: {
      title: "Et maintenant, côté dentaire ?",
      options: [
        { value: "routine", label: "Un suivi de routine me suffit" },
        { value: "soins_reguliers", label: "J'ai besoin de soins réguliers" },
        {
          value: "soins_specifiques",
          label: "J'ai besoin de soins spécifiques",
        },
      ],
      banner: {
        variant: "info",
        title: "On vous répond comme vous préférez.",
        subtitle:
          "Un conseiller reprend votre demande et vous contacte dans le canal choisi pour vous guider.",
        imageSrc: "/alertBanner/speaker.svg",
        imageAlt: "Speaker",
      },
    },

    sante_bien_etre: {
      title: "Et pour votre bien-être ?",
      options: [
        { value: "classiques", label: "Je me limite aux soins classiques" },
        {
          value: "medecines_douces",
          label: "J'utilise parfois des médecines douces",
        },
        {
          value: "routine_complete",
          label: "J'ai une routine bien-être complète",
        },
      ],
      banner: {
        variant: "info",
        title:
          "Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone.",
        subtitle:
          "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
        imageSrc: "/alertBanner/girl.svg",
        imageAlt: "Girl",
      },
    },

    /* ── Souscription ── */

    sexe: {
      title: "Faisons connaissance",
      subtitle: "Vous êtes ?",
      options: [
        { value: "homme", label: "Un homme" },
        { value: "femme", label: "Une femme" },
        { value: "autre", label: "Aucun des deux" },
      ],
    },

    recap: {
      title: "Je crée mon compte",
      subtitle: "Je recevrai un SMS pour confirmer mes infos.",
    },

    envoiSms: {
      title: "Je confirme mon compte",
      subtitle: "J'entre le code reçu par SMS.",
      ctaLabel: "Suivant",
    },

    address: {
      title: "Mes infos personnelles",
    },

    birthPlace: {
      title: "Mes infos personnelles",
      banner: {
        variant: "info",
        title:
          "Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone.",
        subtitle:
          "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
        icon: true,
      },
    },

    socialSecurity: {
      title: "Mes infos d'assurance",
    },

    resilierMutuelle: {
      title: "Mes infos d'assurance",
      options: [
        {
          value: "pas_de_mutuelle",
          label: "Je n'ai pas de mutuelle actuellement",
        },
        { value: "mutuelle_a_resilier", label: "J'ai une mutuelle à résilier" },
      ],
    },

    currentInsurance: {
      title: "Mes infos d'assurance",
      subtitle: "Ma mutuelle actuelle",
    },

    dateSignatureAncien: {
      title: "Mes infos d'assurance",
      banner: {
        title: "Nostrum Care rembourse plus de 40 médecines douces :",
        subtitle:
          "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
        icon: true,
      },
    },

    dateDebutNostrum: {
      title: "Mes infos d'assurance",
      banner: {
        title:
          "Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone.",
        subtitle:
          "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
        imageSrc: "/alertBanner/girl.svg",
        imageAlt: "Girl",
      },
    },
  },
};
