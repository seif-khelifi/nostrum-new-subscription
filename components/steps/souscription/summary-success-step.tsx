"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Placeholder links — wired later to App Store / marketing site. */
const DOWNLOAD_APP_URL = "#";
const DISCOVER_NOSTRUM_URL = "#";

/**
 * Same radial gradient as the Comparateur welcome screen
 * (see `components/steps/devis/comparateur-a-welcome.tsx`).
 */
const SUCCESS_BG =
  "radial-gradient(183.97% 101.35% at 50% 100%, #FBF4EA 0%, #FEA8CD 34.13%, #CE99FF 62.98%, #9000E3 80.77%, #490076 100%)";

/**
 * Success screen rendered by `SummaryStep` after the Stripe subscription
 * is confirmed. Full-viewport overlay (fixed inset-0) that covers the
 * shell's navbar and sidebars, matching the pattern used by
 * `ComparateurWelcome` and `MobileOnboardingHero`.
 */
export function SummarySuccessStep() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white animate-overlay-in"
      style={{ background: SUCCESS_BG }}
    >
      {/* ── Header: Nostrum logo ─────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center px-4 pt-5 pb-3 lg:px-12 lg:pt-10 lg:pb-0 animate-fade-up"
        style={{ animationDelay: "120ms" }}
      >
        <Image
          src="/summary/nostrum.svg"
          alt="Nostrum"
          width={110}
          height={36}
          className="h-7 w-auto lg:h-9"
          priority
        />
      </header>

      {/* ── Body: single-col on mobile, 2-col grid on desktop ────── */}
      <div className="flex-1 flex flex-col min-h-0 lg:items-center lg:justify-center lg:px-12">
        <div
          className="
            flex flex-col flex-1 min-h-0
            lg:grid lg:grid-cols-2 lg:gap-16 lg:max-w-6xl lg:w-full lg:items-center lg:flex-none
          "
        >
          {/* Text + CTAs (top on mobile, left on desktop) */}
          <div className="shrink-0 px-6 pt-2 lg:px-0 lg:pt-0 lg:order-1">
            <h1
              className="font-[family-name:var(--font-bricolage-grotesque)] text-[32px] lg:text-5xl xl:text-6xl font-bold leading-tight lg:leading-[1.05] animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Félicitations !
              <br />
              Vous êtes couvert.e 🎉
            </h1>
            <p
              className="mt-4 lg:mt-6 text-base lg:text-lg leading-relaxed text-white/80 max-w-xl animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              Votre souscription est finalisée. Pour gérer vos demandes de
              remboursements, rendez-vous sur l&apos;application Nostrum Care !
            </p>

            {/* CTAs on desktop (inline with text, left column) */}
            <div
              className="hidden lg:flex mt-10 items-center gap-6 animate-fade-up"
              style={{ animationDelay: "500ms" }}
            >
              <Button variant="ctaPurpleSquared" className="px-8" asChild>
                <a href={DOWNLOAD_APP_URL}>
                  Télécharger l&apos;application
                  <Check className="size-5" />
                </a>
              </Button>
              <a
                href={DISCOVER_NOSTRUM_URL}
                className="text-base font-semibold text-white underline underline-offset-4 hover:opacity-80"
              >
                Découvrir Nostrum Care
              </a>
            </div>
          </div>

          {/* Illustration (middle on mobile, right on desktop) — fades in with a subtle scale */}
          <div
            className="flex-1 flex items-center justify-center px-6 min-h-0 lg:px-0 lg:order-2 animate-fade-scale"
            style={{ animationDelay: "240ms", animationDuration: "560ms" }}
          >
            <picture>
              <source
                srcSet="/summary/stars-desktop.svg"
                media="(min-width: 1024px)"
              />
              <img
                src="/summary/stars-mobile.svg"
                alt=""
                className="w-full h-auto max-h-[50vh] lg:max-h-[70vh] object-contain"
              />
            </picture>
          </div>
        </div>

        {/* CTAs on mobile (bottom of viewport, full-width) */}
        <div
          className="shrink-0 px-6 pb-8 flex flex-col items-start gap-4 lg:hidden animate-fade-up"
          style={{ animationDelay: "520ms" }}
        >
          <Button variant="ctaPurpleSquared" className="w-full" asChild>
            <a href={DOWNLOAD_APP_URL}>
              Télécharger l&apos;application
              <Check className="size-5" />
            </a>
          </Button>
          <a
            href={DISCOVER_NOSTRUM_URL}
            className="self-center text-sm font-semibold text-white underline underline-offset-4"
          >
            Découvrir Nostrum Care
          </a>
        </div>
      </div>
    </div>
  );
}
