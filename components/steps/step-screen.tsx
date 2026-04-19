"use client";

import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { type FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface StepScreenProps {
  /** Section title (e.g. "Votre situation pro ?") */
  title: ReactNode;
  /**
   * When true, the title h1 is hidden on desktop (sm+).
   * Used when the navbar already displays the group title via `navbarTitle`.
   * The title still renders on mobile where the navbar doesn't show it.
   */
  hideTitle?: boolean;
  /** Subtitle / question for this step (optional — can be text or a ReactNode with PillInput) */
  subtitle?: ReactNode;
  /** Optional info card (AlertBanner) displayed between heading and content */
  infoCard?: ReactNode;
  /** Whether the form is currently valid (controls visual styling of the button) */
  canProceed: boolean;
  /** Called when the user clicks "Suivant" */
  onNext: () => void;
  /** Selection content */
  children: ReactNode;
  /** When true, the button will be type="submit" (for form wrappers) */
  isForm?: boolean;
  /** Optional custom action button that replaces the default "Suivant" button */
  customAction?: ReactNode;
  /** Optional form errors to display right before the action button */
  errors?: FieldErrors;
  /** Optional inline error for button-selection steps (shown on mobile only, desktop uses toast) */
  selectionError?: string | null;
}

/**
 * Shared layout for every step screen:
 * title → subtitle → info card → selection options → "Suivant" button (right-aligned)
 *
 * Positioned to the left of the content area with offset from the sidebar.
 *
 * The "Suivant" button is never truly disabled — clicking it when the form
 * is invalid triggers validation so error toasts are shown. The button uses
 * a muted visual style (`aria-disabled`) when `canProceed` is false.
 */
/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/*                                                                     */
/*  The step unfolds from the title down:                             */
/*    heading (0ms) → subtitle (40ms) → info (80ms)                   */
/*    → options (120ms + i·40ms, capped at 6 children)                */
/*    → CTA (220ms).                                                  */
/*                                                                     */
/*  Option children are not wrapped — we use arbitrary Tailwind       */
/*  `[&>*]` selectors to stagger them in place, preserving the        */
/*  caller's layout (some callers rely on inline-width buttons with   */
/*  `justify-between`; wrapping them in a div would break that).      */
/*                                                                     */
/*  All transforms are ≤ 6px / ≤ 320ms. Honored by the global         */
/*  `prefers-reduced-motion: reduce` rule in globals.css.             */
/* ------------------------------------------------------------------ */

export function StepScreen({
  title,
  hideTitle,
  subtitle,
  infoCard,
  onNext,
  children,
  isForm,
  customAction,
  errors,
  selectionError,
}: StepScreenProps) {
  return (
    <div className="flex flex-col gap-5 sm:gap-8 px-2 sm:pl-12 sm:pr-0">
      {/* Heading block */}
      <div className="flex flex-col gap-2">
        <h1
          className={cn(
            "font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold leading-tight text-[#1D1B20] pb-2 sm:pb-4",
            "animate-fade-up",
            hideTitle && "sm:hidden",
          )}
        >
          {title}
        </h1>
        {errors && Object.keys(errors).length > 0 && (
          <p
            className="sm:hidden text-sm font-medium text-red-500 animate-fade-up"
            style={{ animationDelay: "40ms" }}
          >
            {(Object.values(errors)[0]?.message as string | undefined) ??
              "Veuillez corriger les erreurs."}
          </p>
        )}
        {selectionError && (
          <p
            className="sm:hidden text-sm font-medium text-red-500 animate-fade-up"
            style={{ animationDelay: "40ms" }}
          >
            {selectionError}
          </p>
        )}
        {subtitle && (
          <div
            className="font-semibold text-base sm:text-lg text-[#1D1B20] animate-fade-up"
            style={{ animationDelay: "40ms" }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Info card — hidden on desktop when navbar shows the title (variant A moves it to right sidebar) */}
      {infoCard && (
        <div
          className={cn("animate-fade-up", hideTitle && "sm:hidden")}
          style={{ animationDelay: "80ms" }}
        >
          {infoCard}
        </div>
      )}

      {/*
       * Selection options — each direct child fades up with an index-based delay.
       * We use Tailwind arbitrary nth-child selectors so we don't wrap the
       * children and preserve their intrinsic width/flex behavior. Delays are
       * capped so long lists (11-option profil step) don't feel slow.
       */}
      <div
        className={cn(
          "flex flex-col items-start gap-2 sm:gap-3",
          "[&>*]:animate-fade-up",
          "[&>*:nth-child(1)]:[animation-delay:120ms]",
          "[&>*:nth-child(2)]:[animation-delay:160ms]",
          "[&>*:nth-child(3)]:[animation-delay:200ms]",
          "[&>*:nth-child(4)]:[animation-delay:240ms]",
          "[&>*:nth-child(5)]:[animation-delay:280ms]",
          "[&>*:nth-child(n+6)]:[animation-delay:320ms]",
        )}
      >
        {children}
      </div>

      {/* Action button — centered on mobile, right-aligned on desktop */}
      <div
        className="flex justify-center sm:justify-end animate-fade-up"
        style={{ animationDelay: "340ms" }}
      >
        {customAction ?? (
          <Button
            type={isForm ? "submit" : "button"}
            variant="ctaPurple"
            size="cta"
            onClick={isForm ? undefined : onNext}
          >
            Suivant
            <ArrowRight className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
