"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  DevisSideCard                                                      */
/*                                                                     */
/*  Layer 2 composed component:                                        */
/*  Reusable side card for the variant B desktop 2-column layouts.     */
/*  Used in options-variant-b and recap-variant-b.                     */
/*                                                                     */
/*  Structure:                                                         */
/*  - #F6F4F0 outer container with white border                        */
/*  - Top section: title (h1) + subtitle + optional centred image      */
/*  - Bottom section: children slot (pinned to bottom via mt-auto)     */
/* ------------------------------------------------------------------ */

export interface DevisSideCardProps {
  /** Large heading text */
  title: React.ReactNode;
  /** Subtitle / description below the heading */
  subtitle?: React.ReactNode;
  /** Optional centred image below the subtitle */
  imageSrc?: string;
  imageAlt?: string;
  /** Image height class override (default: "h-20") */
  imageClassName?: string;
  /** Bottom-pinned content (e.g. TotalSummary, custom footer) */
  children?: React.ReactNode;
  className?: string;
}

export function DevisSideCard({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  imageClassName = "h-20 w-auto",
  children,
  className,
}: DevisSideCardProps) {
  return (
    <div
      className={cn(
        "bg-[#F6F4F0] border-4 border-white rounded-[24px] overflow-hidden flex flex-col min-h-[500px]",
        className,
      )}
    >
      {/* Top content */}
      <div className="p-6 pt-8 flex-1">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-bricolage-grotesque)] leading-tight text-black mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#1D1B20] text-[0.95rem] leading-relaxed mb-8">
            {subtitle}
          </p>
        )}
        {imageSrc && (
          <div className="flex justify-center">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={160}
              height={80}
              className={imageClassName}
            />
          </div>
        )}
      </div>

      {/* Bottom content — pinned to bottom */}
      {children && <div className="mt-auto">{children}</div>}
    </div>
  );
}
