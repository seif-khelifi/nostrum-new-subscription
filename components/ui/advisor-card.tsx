"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AdvisorCardProps {
  className?: string;
}

/**
 * "Parler à un conseiller" card — standalone reusable component.
 *
 * Extracted from the mobile navbar CTA bar (mobile-step-navbar.tsx)
 * and wrapped in a rounded container for use in any layout context.
 *
 * Uses the variant system's purple theme (#490076) consistent with
 * the sidebar-right AlertBanner (sidebarDark) and mobile navbar.
 */
export function AdvisorCard({ className }: AdvisorCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-[#490076] text-white",
        /* Progressive padding + gap — tighter on mid viewports, roomier on xl+ */
        "px-3 py-2.5 gap-2 xl:px-4 xl:py-3 xl:gap-3",
        className,
      )}
    >
      {/* Text */}
      <div className="min-w-0">
        <p className="font-semibold text-[13px] xl:text-[15px] m-0 whitespace-nowrap">
          Parler à un conseiller
        </p>
        <p className="text-[11px] xl:text-[13px] opacity-75 mt-0.5 mb-0 whitespace-nowrap">
          On vous rappelle <br />
          dans la journée
        </p>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
        {/* Image — hidden on mid viewports to save space, shown from xl+ */}
        <Image
          src="/navbarMobile/pill.svg"
          alt="Conseillers"
          width={80}
          height={40}
          className="hidden xl:block h-10 w-auto object-contain shrink-0"
          unoptimized
        />

        {/* Button */}
        <Button
          variant="mobileCallPill"
          asChild
          className="shrink-0 xl:-ml-2.5 relative z-10"
        >
          <a href="tel:+33000000000" aria-label="Appeler un conseiller">
            <Phone size={16} />
          </a>
        </Button>
      </div>
    </div>
  );
}
