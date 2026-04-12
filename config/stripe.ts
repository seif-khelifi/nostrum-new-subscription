/**
 * Stripe Appearance — matches the project's selectOption button design system.
 * Tabs mimic Button variant="selectOption" (white bg, purple text, purple glow when selected).
 * Inputs use the PillInput color palette (light purple bg, purple text).
 */
export const stripeAppearance = {
  theme: "flat" as const,
  variables: {
    // Typography
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "15px",
    fontWeightNormal: "500",

    // Colors
    colorPrimary: "#490076",
    colorBackground: "#F3E5FA",
    colorText: "#1D1B20",
    colorTextPlaceholder: "#8E7A9E",
    colorDanger: "#ef4444",
    colorIcon: "#490076",
    colorIconTabSelected: "#490076",

    // Borders & Radius
    borderRadius: "12px",
    spacingUnit: "4px",
    spacingGridRow: "16px",
    spacingGridColumn: "16px",
  },
  rules: {
    /* ── Tabs: mimic selectOption buttons ── */
    ".Tab": {
      backgroundColor: "#ffffff",
      color: "#490076",
      border: "1px solid #E9E3DD",
      borderRadius: "16px",
      fontWeight: "600",
      fontSize: "14px",
      padding: "10px 20px",
      boxShadow: "none",
      transition: "all 0.15s ease",
    },
    ".Tab:hover": {
      backgroundColor: "#faf7fc",
      border: "1px solid rgba(200,111,254,0.7)",
    },
    ".Tab--selected": {
      backgroundColor: "#ffffff",
      color: "#490076",
      border: "1px solid #C86FFE",
      boxShadow: "0 0 0 4px rgba(200,111,254,0.35)",
    },
    ".Tab--selected:hover": {
      backgroundColor: "#ffffff",
      color: "#490076",
      border: "1px solid #C86FFE",
      boxShadow: "0 0 0 4px rgba(200,111,254,0.35)",
    },
    ".TabIcon": {
      fill: "#490076",
    },
    ".TabIcon--selected": {
      fill: "#490076",
    },
    ".TabLabel": {
      color: "#490076",
      fontWeight: "600",
    },
    ".TabLabel--selected": {
      color: "#490076",
      fontWeight: "600",
    },

    /* ── Inputs: PillInput style (light purple bg) ── */
    ".Input": {
      backgroundColor: "#F3E5FA",
      color: "#490076",
      border: "1px solid transparent",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "500",
      padding: "10px 14px",
      transition: "all 0.15s ease",
    },
    ".Input:focus": {
      border: "1px solid #C86FFE",
      boxShadow: "0 0 0 2px rgba(73,0,118,0.2)",
      backgroundColor: "#F3E5FA",
    },
    ".Input--invalid": {
      border: "1px solid #ef4444",
      boxShadow: "0 0 0 2px rgba(239,68,68,0.2)",
    },

    /* ── Labels & Errors ── */
    ".Label": {
      color: "#1D1B20",
      fontWeight: "600",
      fontSize: "14px",
    },
    ".Error": {
      color: "#ef4444",
      fontSize: "13px",
      fontWeight: "500",
    },

    /* ── Block (form container) — transparent to blend with page bg ── */
    ".Block": {
      backgroundColor: "transparent",
      borderColor: "transparent",
      boxShadow: "none",
    },
  },
};

/** Stripe Elements provider options (deferred SetupIntent mode) */
export const elementsOptions = {
  mode: "setup" as const,
  currency: "eur",
  locale: "fr" as const,
  paymentMethodTypes: ["card", "sepa_debit"],
  setupFutureUsage: "off_session" as const,
  appearance: stripeAppearance,
};

/** PaymentElement options — tabs layout, hidden billing (already collected) */
export const paymentElementOptions = {
  layout: "tabs" as const,
  paymentMethodOrder: ["card", "sepa_debit"],
  wallets: { applePay: "never" as const, googlePay: "never" as const },
  fields: {
    billingDetails: {
      address: {
        line1: "never" as const,
        line2: "never" as const,
        city: "never" as const,
        state: "never" as const,
        postalCode: "never" as const,
        country: "never" as const,
      },
    },
  },
};

/** ExpressCheckoutElement options (Apple Pay / Google Pay) */
export const expressCheckoutOptions = {
  buttonType: {
    applePay: "plain" as const,
    googlePay: "plain" as const,
  },
};
