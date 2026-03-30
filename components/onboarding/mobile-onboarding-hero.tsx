"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MobileOnboardingHeroProps {
  onStart?: () => void;
}

/**
 * Mobile-only onboarding landing page.
 *
 * Layout (top → bottom):
 * 1. Top bar: logo + "Parler à un conseiller" CTA
 * 2. Hero headline (all-caps, multi-line)
 * 3. 2×2 feature card grid
 * 4. Full-width container illustration
 * 5. "Faisons connaissance" heading + CTA button
 *
 * The MobileShell removes its padding when on the onboarding step,
 * so this component renders edge-to-edge.
 */
export function MobileOnboardingHero({ onStart }: MobileOnboardingHeroProps) {
  return (
    <div className="flex flex-col sm:hidden">
      {/* ── Upper section with gradient background ─────────── */}
      <div
        className="flex flex-col"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 49.52%, #F1D8FF 100%)",
        }}
      >
        {/* ── Top bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3">
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

        {/* ── Hero headline ────────────────────────────────── */}
        <div className="px-4 pt-6 pb-6">
          <h1 className="leading-[1.1] uppercase">
            <span className="text-[#34266D]">La couverture</span>
            <br />
            <span className="text-[#C86FFE]">santé</span>
            <br />
            <span className="text-[#C86FFE]">& bien-être</span>
            <br />
            <span className="text-[#34266D]">qui s&apos;adapte</span>
            <br />
            <span className="text-[#34266D]">vraiment à vous.</span>
          </h1>
        </div>

        {/* ── Feature cards (2×2 grid) ─────────────────────── */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-8">
          {/* Card 1 */}
          <div className="rounded-2xl bg-white p-4 ring-1 ring-foreground/5">
            <p className="text-sm text-[#34266D]">
              Couverture <span className="font-bold">personnalisée</span>
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
              Remboursements <span className="font-bold">bien-être</span>
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
            <Image src="/onboarding/heart.svg" alt="" width={32} height={32} />
            <Image src="/onboarding/mail.svg" alt="" width={32} height={32} />
          </div>
        </div>
      </div>

      {/* ── Full-width container illustration ────────────────── */}
      <div className="w-full">
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
      <div className="flex flex-col items-start gap-6 px-4 py-10">
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
  );
}
