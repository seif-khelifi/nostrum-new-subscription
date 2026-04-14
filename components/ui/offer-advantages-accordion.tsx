"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ------------------------------------------------------------------ */
/*  OfferAdvantagesAccordion                                           */
/*                                                                     */
/*  Layer 2 composed component: single-item accordion that reveals     */
/*  a list of advantage lines (title + optional subtitle + image).     */
/*  Designed to sit below the description inside an OfferCard on       */
/*  desktop.                                                           */
/* ------------------------------------------------------------------ */

export type AdvantageLineItem = {
  title: string;
  subtitle?: string;
  imageSrc: string;
};

export interface OfferAdvantagesAccordionProps {
  /** Unique value for the accordion item (e.g. the plan name) */
  value: string;
  /** Trigger label — defaults to "Voir les avantages" */
  triggerLabel?: string;
  /** Optional image displayed next to the trigger label (emoji-sized) */
  triggerImage?: string;
  /** Custom colour for the trigger title text */
  triggerTitleColor?: string;
  /** The advantage rows to render when open */
  lines: AdvantageLineItem[];
  className?: string;
}

function OfferAdvantagesAccordion({
  value,
  triggerLabel = "Voir les avantages",
  triggerImage,
  triggerTitleColor,
  lines,
  className,
}: OfferAdvantagesAccordionProps) {
  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      <AccordionItem value={value} className="border-b-0">
        <AccordionTrigger className="py-4 hover:no-underline">
          <span className="flex items-center gap-2">
            {triggerImage && (
              <Image
                src={triggerImage}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            )}
            {/* Inter, bold — matches garanties-variant-a trigger style */}
            <span
              className="text-xl font-bold"
              style={{ color: triggerTitleColor ?? "#9000E3" }}
            >
              {triggerLabel}
            </span>
          </span>
        </AccordionTrigger>

        <AccordionContent className="pb-4 [&_p]:!mb-0">
          <div className="flex flex-col gap-4">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4"
              >
                {/* Text — left side */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug text-[#290E67]">
                    {line.title}
                  </p>
                  {line.subtitle && (
                    <p className="text-sm leading-none text-[#1D1B20]">
                      {line.subtitle}
                    </p>
                  )}
                </div>

                {/* Image — right side */}
                <div className="shrink-0">
                  <Image
                    src={line.imageSrc}
                    alt={line.title}
                    width={48}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export { OfferAdvantagesAccordion };
