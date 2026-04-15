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
        "flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-[#490076] px-4 py-3 text-white gap-3",
        className,
      )}
    >
      {/* Text */}
      <div>
        <p className="font-semibold text-[15px] m-0">Parler à un conseiller</p>
        <p className="text-[13px] opacity-75 mt-0.5 mb-0">
          On vous rappelle dans la journée
        </p>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
        {/* Image */}
        <Image
          src="/navbarMobile/pill.svg"
          alt="Conseillers"
          width={80}
          height={40}
          className="h-10 w-auto object-contain shrink-0"
          unoptimized
        />

        {/* Button */}
        <Button
          variant="mobileCallPill"
          asChild
          className="shrink-0 -ml-2.5 relative z-10"
        >
          <a href="tel:+33000000000" aria-label="Appeler un conseiller">
            <Phone size={16} />
          </a>
        </Button>
      </div>
    </div>
  );
}
