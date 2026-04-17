"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  AdvisorSidebarCard                                                 */
/*                                                                     */
/*  Layer 2 composed component:                                        */
/*  - Purple Card primitive (variant="sidebarDark")                    */
/*  - Title + subtitle at the top (padded)                             */
/*  - Image hugging left / right / bottom edges of the card            */
/*  - Whole card wrapped in a `tel:` link (keyboard & screen reader    */
/*    accessible via the anchor semantics)                             */
/*                                                                     */
/*  Used in components/layout/desktop/sidebar-right.tsx to replace the */
/*  previous `AlertBanner variant="sidebarDark"` instance.             */
/* ------------------------------------------------------------------ */

export interface AdvisorSidebarCardProps {
  /** Main line — defaults to "Parler à un conseiller" */
  title?: React.ReactNode;
  /** Second line — defaults to "On vous rappelle dans la journée" */
  subtitle?: React.ReactNode;
  /** Bottom illustration — defaults to /alertBanner/call.svg */
  imageSrc?: string;
  /** Accessible description of the image */
  imageAlt?: string;
  /** Phone number for the tel: link. Omit to render as a div (non-clickable). */
  tel?: string;
  className?: string;
}

export function AdvisorSidebarCard({
  title = "Parler à un conseiller",
  subtitle = "On vous rappelle dans la journée",
  imageSrc = "/alertBanner/call.svg",
  imageAlt = "Appeler un conseiller",
  tel,
  className,
}: AdvisorSidebarCardProps) {
  const content = (
    <Card
      variant="sidebarDark"
      className={cn(
        "group/advisor-sidebar-card transition-[background-color,opacity] duration-200",
        tel && "hover:bg-[#5B007F] active:opacity-90",
        className,
      )}
    >
      {/* Text block — padded, sits above the image */}
      <div className="px-4 pt-3.5 pb-2">
        <CardTitle className="text-base font-bold leading-5 text-white">
          {title}
        </CardTitle>
        <CardDescription className="mt-0.5 text-sm leading-5 text-white/80">
          {subtitle}
        </CardDescription>
      </div>

      {/* Image — hugs left / right / bottom edges of the card.
          `px-1 pb-1` keeps a 4px hairline gap so the rounded corners
          of the card show through; remove if you want true 0px flush. */}
      <div className="relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={200}
          className="w-full h-auto object-contain rounded-[12px]"
          priority={false}
        />
      </div>
    </Card>
  );

  if (!tel) return content;

  return (
    <a
      href={`tel:${tel}`}
      aria-label={typeof title === "string" ? title : "Appeler un conseiller"}
      className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9000E3] focus-visible:ring-offset-2 rounded-2xl"
    >
      {content}
    </a>
  );
}
