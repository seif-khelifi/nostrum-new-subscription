"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  HelpCtaCard                                                        */
/*                                                                     */
/*  Layer 2 composed component:                                        */
/*  Dark call-to-action card with title, description, and a            */
/*  full-width white button. Used for "need help deciding?" prompts.   */
/* ------------------------------------------------------------------ */

export interface HelpCtaCardProps {
  /** Card heading */
  title: React.ReactNode;
  /** Card body text */
  description: React.ReactNode;
  /** Button label */
  ctaLabel: React.ReactNode;
  /** Button click handler */
  onCtaClick?: () => void;
  className?: string;
}

export function HelpCtaCard({
  title,
  description,
  ctaLabel,
  onCtaClick,
  className,
}: HelpCtaCardProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[24px] bg-black p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <p className="text-xl font-bold leading-tight text-white">
          {title}
        </p>
        <p className="text-sm leading-snug text-white/90">
          {description}
        </p>
        <Button
          variant="default"
          className="w-full rounded-[20px] border-0 bg-white text-black min-h-[48px] h-auto py-3 text-sm font-semibold shadow-none hover:bg-white/90 lg:min-h-11"
          onClick={onCtaClick}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
