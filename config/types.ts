import type { ReactNode, ComponentType } from "react";

/* ------------------------------------------------------------------ */
/*  Step & Group definitions (moved from StepperContext)               */
/* ------------------------------------------------------------------ */

export type StepId =
  | "onboarding"
  | "profil"
  | "dob"
  | "sexe"
  | "personalInfo"
  | "mail"
  | "phoneNumber"
  | "address"
  | "birthPlace"
  | "proteger"
  | "nousSommes"
  | "commenceParQui"
  | "dateBirthConjoint"
  | "recap"
  | "envoiSms"
  | "sante_yeux"
  | "sante_dents"
  | "sante_bien_etre"
  | "transition_offer"
  | "devis_placeholder"
  | "garanties"
  | "comparateur_welcome"
  | "offre_comparateur"
  | "options"
  | "socialSecurity"
  | "resilierMutuelle"
  | "currentInsurance"
  | "dateSignatureAncien"
  | "dateDebutNostrum"
  | "souscription_placeholder";

export interface StepDef {
  id: StepId;
  label: string;
}

export interface StepGroup {
  id: number;
  label: string;
  steps: StepDef[];
}

/* ------------------------------------------------------------------ */
/*  Banner configuration                                              */
/* ------------------------------------------------------------------ */

export interface BannerConfig {
  /** Alert variant — maps to AlertBanner's `variant` prop */
  variant?: "info" | "default" | "warning" | "success" | "destructive";
  /** Banner title text */
  title: ReactNode;
  /** Banner subtitle / description text */
  subtitle?: ReactNode;
  /** Show an icon (rendered via <InfoIcon>) */
  icon?: boolean;
  /** Show an image instead of an icon */
  imageSrc?: string;
  /**
   * Horizontal variant of the image — used when the banner is rendered
   * in a sidebar card (wider aspect ratio). Falls back to `imageSrc`
   * when not provided.
   */
  imageSrcHorizontal?: string;
  imageAlt?: string;
}

/* ------------------------------------------------------------------ */
/*  Per-step text configuration                                       */
/* ------------------------------------------------------------------ */

export interface StepTexts {
  /** Page title (h1) — required: always provided by the variant config */
  title: ReactNode;
  /**
   * When set, the desktop navbar displays this as an h1 title (replacing the
   * progress bar), and the step's inner `title` is hidden to avoid duplication.
   * Steps check `navbarTitle` to decide whether to render their own heading.
   */
  navbarTitle?: string;
  /** Subtitle / question line — plain string only; complex subtitles stay in the component */
  subtitle?: ReactNode;
  /** AlertBanner config — set to `null` to explicitly hide a banner that the default has */
  banner?: BannerConfig | null;
  /** Option labels for selection steps (profil, proteger, etc.) */
  options?: Array<{ value: string; label: string }>;
  /** CTA button label (defaults to "Suivant" when omitted) */
  ctaLabel?: string;
  /**
   * Escape hatch: arbitrary key-value bag for obscure per-step overrides
   * that don't fit the standard fields above. Components can read from this
   * via `useStepTexts(id).extra?.someKey`. Easy to remove once stabilized.
   */
  extra?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Skip rules — conditional step routing                             */
/* ------------------------------------------------------------------ */

/**
 * A skip rule tells the stepper: "when leaving step `from`, if the
 * field `field` on `session.beneficiaries[0]` equals `value`, jump to
 * `target` instead of the next step in the flat list."
 *
 * `next()` checks rules where `from` matches the current step.
 * `back()` checks rules where `target` matches the current step.
 * This keeps forward and backward navigation automatically symmetric.
 */
export interface SkipRule {
  /** The step the user is leaving */
  from: StepId;
  /** Key on `session.beneficiaries[0]` to check */
  field: string;
  /** Value that triggers the skip */
  value: string;
  /** The step to jump to */
  target: StepId;
}

/* ------------------------------------------------------------------ */
/*  Layout configuration — declarative shell/sidebar/navbar behavior  */
/* ------------------------------------------------------------------ */

export interface VariantLayoutConfig {
  sidebar: {
    /** Stepper color theme applied to the left sidebar */
    theme: "default" | "purple";
    /** Whether to show the right sidebar (AlertBanner cards) */
    showRightSidebar: boolean;
  };
  navbar: {
    /** Show a progress bar in the desktop navbar */
    showProgressBar: boolean;
    /** Show the "Parler à un conseiller" CTA pill in the desktop navbar */
    showCta: boolean;
  };
}

/* ------------------------------------------------------------------ */
/*  Variant configuration                                             */
/* ------------------------------------------------------------------ */

export type VariantKey = "a" | "b";

export interface VariantConfig {
  /** Variant identifier */
  id: VariantKey;

  /** Step groups and ordering — controls the entire flow */
  stepGroups: StepGroup[];

  /**
   * Per-step texts — the single source of truth for all user-facing copy.
   * Every step that calls `useStepTexts(id)` MUST have a corresponding
   * entry here; the hook will throw at runtime if one is missing.
   */
  texts: Partial<Record<StepId, StepTexts>>;

  /**
   * Per-step component overrides.
   * Only needed for steps that render entirely different layouts per variant
   * (e.g. devis pages). Most steps share the same component and just read
   * different text from `texts`.
   */
  components?: Partial<Record<StepId, ComponentType>>;

  /**
   * Conditional skip rules for non-linear step navigation.
   * Drives both `next()` and `back()` in the stepper so forward/backward
   * routing stays automatically symmetric.
   */
  skipRules?: SkipRule[];

  /**
   * Declarative layout configuration — controls sidebar theme,
   * right sidebar visibility, and navbar features.
   * Shell components read from this instead of checking variant IDs.
   */
  layout: VariantLayoutConfig;
}
