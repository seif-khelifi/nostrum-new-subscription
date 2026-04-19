"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MobileOnboardingHeroProps {
  onStart?: () => void;
}

/**
 * Onboarding landing page — both mobile and desktop.
 *
 * Mobile layout (top → bottom, < sm):
 * 1. Top bar: logo + "Parler à un conseiller" CTA
 * 2. Hero headline (all-caps, multi-line)
 * 3. 2×2 feature card grid
 * 4. Full-width container illustration
 * 5. "Faisons connaissance" heading + CTA button
 *
 * Desktop layout (≥ sm):
 * Fixed overlay covering the entire viewport (over navbar/sidebar).
 * Top bar + centered container split in half:
 * - Left: headline, feature cards, CTA
 * - Right: Container.svg illustration with rounded corners
 *
 * Works for both variant A and variant B.
 */
export function MobileOnboardingHero({ onStart }: MobileOnboardingHeroProps) {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/*  DESKTOP — fixed full-screen overlay (≥ sm / 640px)    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div
        className="hidden sm:flex fixed inset-0 z-50 flex-col"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 49.04%, #F1D8FF 100%)",
        }}
      >
        {/* ── Top bar ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-8 lg:px-12 pt-6 pb-4 animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <Image
            src="/onboarding/Vector.svg"
            alt="Nostrum"
            width={120}
            height={32}
            priority
          />
          <Button
            variant="onboardingAdvisor"
            onClick={() => {
              window.location.href = "tel:+33000000000";
            }}
          >
            <Phone className="size-4" />
            Parler à un conseiller
          </Button>
        </div>

        {/* ── Centered split container ─────────────────────── */}
        <div className="flex flex-1 items-center justify-center px-8 lg:px-16 xl:px-24 pb-8">
          <div className="flex w-full max-w-6xl gap-10 lg:gap-16 items-center">
            {/* ── Left half: content ───────────────────────── */}
            <div className="flex flex-1 flex-col justify-center">
              {/*
               * Hero headline — each colored line fades up in sequence.
               * The purple accent spans (santé / & bien-être) arrive last
               * so the brand color "lands" visibly rather than appearing
               * already painted.
               */}
              <h1 className="leading-[1.1] uppercase">
                <span className="text-[#34266D] inline-block animate-fade-up" style={{ animationDelay: "60ms" }}>La couverture</span>
                <br />
                <span className="text-[#C86FFE] inline-block animate-fade-up" style={{ animationDelay: "300ms" }}>santé</span>
                <br />
                <span className="text-[#C86FFE] inline-block animate-fade-up" style={{ animationDelay: "360ms" }}>& bien-être</span>
                <br />
                <span className="text-[#34266D] inline-block animate-fade-up" style={{ animationDelay: "180ms" }}>qui s&apos;adapte</span>
                <br />
                <span className="text-[#34266D] inline-block animate-fade-up" style={{ animationDelay: "240ms" }}>vraiment à vous.</span>
              </h1>

              {/* Feature cards (2×2 grid) — fade up after the headline lands */}
              <div
                className={cn(
                  "grid grid-cols-2 gap-3 mt-8 max-w-md",
                  "[&>*]:animate-fade-up",
                  "[&>*:nth-child(1)]:[animation-delay:460ms]",
                  "[&>*:nth-child(2)]:[animation-delay:510ms]",
                  "[&>*:nth-child(3)]:[animation-delay:560ms]",
                  "[&>*:nth-child(4)]:[animation-delay:610ms]",
                )}
              >
                {/* Card 1 */}
                <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
                  <p className="text-sm text-[#34266D]">
                    Couverture{" "}
                    <span className="font-bold">personnalisée</span>
                  </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
                  <p className="text-sm text-[#34266D]">
                    App <span className="font-bold">simple et rapide</span>
                  </p>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
                  <p className="text-sm text-[#34266D]">
                    Remboursements{" "}
                    <span className="font-bold">bien-être</span>
                  </p>
                </div>

                {/* Card 4 — gradient with icons */}
                <div
                  className="flex items-center justify-center gap-2 rounded-2xl p-4"
                  style={{
                    background:
                      "linear-gradient(262.29deg, #CE99FF 0%, #FEA8CD 99.07%)",
                  }}
                >
                  <Image
                    src="/onboarding/dumbell.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                  <Image
                    src="/onboarding/heart.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                  <Image
                    src="/onboarding/mail.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
              </div>

              {/* CTA section — lands last */}
              <div
                className="flex items-center gap-4 mt-8 animate-fade-up"
                style={{ animationDelay: "720ms" }}
              >
                <Button
                  variant="ctaPurpleSquared"
                  className="h-14 px-8"
                  onClick={onStart}
                >
                  Comparer nos offres
                </Button>

                <p className="text-xs text-[#1D1B20]">
                  60 secondes.
                  <br />
                  Aucune obligation.
                </p>
              </div>
            </div>

            {/* ── Right half: illustration ─────────────────── */}
            <div className="flex flex-1 items-center justify-center">
              <div
                className="w-full max-w-lg overflow-hidden rounded-[3rem] animate-fade-scale"
                style={{ animationDelay: "420ms", animationDuration: "520ms" }}
              >
                <Image
                  src="/onboarding/Container.svg"
                  alt="Nostrum app preview"
                  width={390}
                  height={300}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  MOBILE — inline flow (< sm / 640px)                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:hidden">
        {/* ── Upper section with gradient background ─────────── */}
        <div
          className="flex flex-col"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 49.52%, #F1D8FF 100%)",
          }}
        >
          {/* ── Top bar ──────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 pt-6 pb-3 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Image
              src="/onboarding/Vector.svg"
              alt="Nostrum"
              width={100}
              height={28}
              priority
            />
            <Button
              variant="onboardingAdvisor"
              onClick={() => {
                window.location.href = "tel:+33000000000";
              }}
            >
              <Phone className="size-4" />
              Parler à un conseiller
            </Button>
          </div>

          {/* ── Hero headline (sequenced line reveal) ────────── */}
          <div className="px-4 pt-6 pb-6">
            <h1 className="leading-[1.1] uppercase">
              <span className="text-[#34266D] inline-block animate-fade-up" style={{ animationDelay: "60ms" }}>La couverture</span>
              <br />
              <span className="text-[#C86FFE] inline-block animate-fade-up" style={{ animationDelay: "300ms" }}>santé</span>
              <br />
              <span className="text-[#C86FFE] inline-block animate-fade-up" style={{ animationDelay: "360ms" }}>& bien-être</span>
              <br />
              <span className="text-[#34266D] inline-block animate-fade-up" style={{ animationDelay: "180ms" }}>qui s&apos;adapte</span>
              <br />
              <span className="text-[#34266D] inline-block animate-fade-up" style={{ animationDelay: "240ms" }}>vraiment à vous.</span>
            </h1>
          </div>

          {/* ── Feature cards (2×2 grid) — stagger after headline ── */}
          <div
            className={cn(
              "grid grid-cols-2 gap-3 px-4 pb-8",
              "[&>*]:animate-fade-up",
              "[&>*:nth-child(1)]:[animation-delay:460ms]",
              "[&>*:nth-child(2)]:[animation-delay:510ms]",
              "[&>*:nth-child(3)]:[animation-delay:560ms]",
              "[&>*:nth-child(4)]:[animation-delay:610ms]",
            )}
          >
            {/* Card 1 */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
              <p className="text-sm text-[#34266D]">
                Couverture{" "}
                <span className="font-bold">personnalisée</span>
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
              <p className="text-sm text-[#34266D]">
                App <span className="font-bold">simple et rapide</span>
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
              <p className="text-sm text-[#34266D]">
                Remboursements{" "}
                <span className="font-bold">bien-être</span>
              </p>
            </div>

            {/* Card 4 — gradient with icons */}
            <div
              className="flex items-center justify-center gap-2 rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(262.29deg, #CE99FF 0%, #FEA8CD 99.07%)",
              }}
            >
              <Image
                src="/onboarding/dumbell.svg"
                alt=""
                width={32}
                height={32}
              />
              <Image
                src="/onboarding/heart.svg"
                alt=""
                width={32}
                height={32}
              />
              <Image
                src="/onboarding/mail.svg"
                alt=""
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>

        {/* ── Full-width container illustration ────────────────── */}
        <div
          className="w-full animate-fade-scale"
          style={{ animationDelay: "680ms", animationDuration: "520ms" }}
        >
          <Image
            src="/onboarding/Container.svg"
            alt="Nostrum app preview"
            width={390}
            height={300}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* ── Bottom CTA section ──────────────────────────────── */}
        <div
          className="flex flex-col items-start gap-6 px-4 py-10 animate-fade-up"
          style={{ animationDelay: "820ms" }}
        >
          <h1 className="text-[#34266D]">Faisons connaissance</h1>

          <Button
            variant="ctaPurpleSquared"
            className="w-full h-14"
            onClick={onStart}
          >
            Comparer nos offres
          </Button>
        </div>
      </div>
    </>
  );
}
