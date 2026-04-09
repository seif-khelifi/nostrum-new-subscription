import type { VariantConfig } from "./types";

/**
 * Variant B — alternative experience.
 *
 * This config is the single source of truth for all user-facing copy,
 * step ordering, banners, and options. Step components read directly
 * from here and must never hardcode fallback text.
 */
export const variantB: VariantConfig = {
  id: "b",

  /* ────────────────────────────────────────────────────────────── */
  /*  Layout — sidebar, navbar, shell behavior                     */
  /* ────────────────────────────────────────────────────────────── */

  layout: {
    sidebar: { theme: "default", showRightSidebar: false },
    navbar: { showProgressBar: true, showCta: true },
  },

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
        { id: "dob", label: "Date de naissance" },
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
        // { id: "transition_offer", label: "Transition" },
      ],
    },

    {
      id: 5,
      label: "Devis",
      steps: [
        { id: "devis_placeholder", label: "Devis" },
        { id: "garanties", label: "Garanties" },
        { id: "comparateur_welcome", label: "Comparateur Bienvenue" },
        { id: "offre_comparateur", label: "Offre Comparateur" },
        { id: "options", label: "Options" },
      ],
    },
    {
      id: 6,
      label: "Souscription",
      steps: [
        { id: "sexe", label: "Sexe" },
        { id: "personalInfo", label: "Informations personnelles" },
        { id: "mail", label: "Adresse e-mail" },
        { id: "phoneNumber", label: "Numéro de téléphone" },
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
    // "Mon conjoint(e) et moi" → skip nousSommes (familyCount is hard-set to 2), jump to commenceParQui
    { from: "proteger", field: "proteger", value: "conjoint_et_moi", target: "commenceParQui" },
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
      title: "Votre situation pro en ce moment ?",
      options: [
        { value: "EMPLOYEE", label: "Salarié(e)" },
        { value: "SELF_EMPLOYED", label: "Indépendant(e)" },
        { value: "STUDENT", label: "Étudiant(e)" },
        { value: "PARENT_AT_HOME", label: "Parent au foyer" },
        { value: "FONCTIONARY", label: "Fonctionnaire" },
        { value: "INTERIM_WORKER", label: "Intérimaire" },
        { value: "RETIRED", label: "Retraité(e)" },
        { value: "PRACTITIONER", label: "Praticien(ne)" },
        { value: "BUSINESS_OWNER", label: "Chef d'entreprise" },
        { value: "JOB_SEEKER", label: "Chercheur d'emploi" },
        { value: "OTHER", label: "Autre" },
      ],
    },

    dob: {
      title: "Quand êtes-vous né ?",
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
        title: "C'est vous qui choisissez comment poursuivre l'échange.",
        subtitle: "...vous contacte par email, téléphone ou watsapp",
        imageSrc: "/alertBanner/speaker.svg",
        imageSrcHorizontal: "/alertBanner/speaker-hor.svg",
        imageAlt: "Speaker",
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
        title: "C'est vous qui choisissez comment poursuivre l'échange.",
        subtitle: "...vous contacte par email, téléphone ou watsapp",
        imageSrc: "/alertBanner/speaker.svg",
        imageSrcHorizontal: "/alertBanner/speaker-hor.svg",
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
        title: "C'est vous qui choisissez comment poursuivre l'échange.",
        subtitle: "...vous contacte par email, téléphone ou watsapp",
        imageSrc: "/alertBanner/speaker.svg",
        imageSrcHorizontal: "/alertBanner/speaker-hor.svg",
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
          "On rembourse 10 fois.plus de médecines douces que les autres mutuelles",
        subtitle:
          "Òstéopathie, Sophrologie, Psychologie, Acupuncture, Naturopathie, Coaching, et bien plus.",
        imageSrc: "/alertBanner/girl.svg",
        imageSrcHorizontal: "/alertBanner/girl-hor.svg",
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
        imageSrcHorizontal: "/alertBanner/girl-hor.svg",
        imageAlt: "Girl",
      },
    },

    /* ── Options ── */

    options: {
      title: "Renforcez votre couverture",
    },

    /* ── Garanties ── */

    garanties: {
      title: "Et concrètement, les avantages pour vous ?",
      extra: {
        subtitleTemplate:
          "Découvrez pourquoi {offer} est faite pour vous, en prenant soin de ce que les autres oublient.",
        seeGuaranteesLabel: "Voir le tableau de garanties",
        ctaTemplate: "Je choisis la formule {offer}",
        offerColors: {
          decouverte: "#F3E5FA",
          bronze: "#FFF7E8",
          silver: "#F4F3FA",
          gold: "#FEFFF4",
        },
        accordion: [
          {
            value: "soins-courants",
            title:
              "Prendre en charge c'est bien, prendre en compte le bien-être c'est mieux",
            description:
              "Silver c'est Ostéo, médecines douces, compléments alimentaires. Ce que le Silver offre en plus :",
            colorScheme: "purple",
            cards: [
              { title: "Téléconsulta tion médecin", description: "6/ an" },
              {
                title: "Chat médical psy",
                description: "7j/7 de 8h à 22h",
              },
            ],
            detailCard: {
              highlightText:
                "<b>1 consultation psy offerte </b> pour 3 consultations réalisées ",
              ctaLabel: "Mes remboursements bien-être",
              infoTitle:
                "Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone.",
              infoText:
                "ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus.",
              rightCard: {
                title: "Psy",
                description: "5 séances/an pour 30€",
              },
            },
          },
          {
            value: "dentaire-optique",
            title:
              "Nostrum Vita couvre aussi vos besoins de santé classiques",
            description:
              "On rembourse les frais en Optique, Dentaire, Hospitalisation et de médecine courante",
            colorScheme: "warm",
            cards: [
              { title: "Optique", description: "100 %" },
              { title: "Dentaire", description: "100 %" },
              {
                title: "Médecins & téléconsultations",
                description: "100 %",
              },
              {
                title: "Hospitalisation",
                description: "Remboursement total",
              },
            ],
            ctaLabel: "Voir les détails dentaire & optique",
          },
          {
            value: "hospitalisation",
            title: "Des avantages et services en plus",
            description: "",
            colorScheme: "blue",
            cards: [
              {
                title: "Club Avantages",
                description:
                  "-10% à -50% (vacances, ciné, sport, shopping et bien plus)",
              },
              {
                title: "Téléconsulta tion",
                description:
                  "En visio ou par téléphone, assurée par un médecin, disponible 24h/24h et 7j/7 partout dans le monde.",
              },
              {
                title: "Soins à l'étranger",
                description:
                  "Vos frais médicaux à l'étranger sont pris en charge pendant un séjour temporaire de moins 3 mois.",
              },
              {
                title: "Visible patient",
                description:
                  "La modélisation des organes en 3D à partir d'un Scanner ou d'une IRM inclus dans la formule",
              },
            ],
          },
        ],
      },
    },
  },
};
