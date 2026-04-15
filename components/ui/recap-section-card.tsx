"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  RecapSectionCard                                                   */
/*                                                                     */
/*  Layer 2 composed component: outer #F3E5FA container with a title   */
/*  label, children rendered directly inside (each child should be a   */
/*  white card), and a "+ J'ajoute …" button at bottom.                */
/*  Reused for both "Vos options" and "Vos informations" sections.     */
/* ------------------------------------------------------------------ */

export interface RecapSectionCardProps {
  /** Section heading (e.g. "Vos options", "Vos informations") */
  title: string;
  /** Label for the add button at bottom */
  addLabel: string;
  /** Handler for the add button */
  onAdd?: () => void;
  /** Item cards rendered inside (each is its own white card) */
  children: React.ReactNode;
  className?: string;
}

function RecapSectionCard({
  title,
  addLabel,
  onAdd,
  children,
  className,
}: RecapSectionCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[28px] bg-[#F3E5FA] overflow-hidden",
        className,
      )}
    >
      {/* Top label */}
      <div className="flex items-center justify-center px-5 pt-4 pb-3">
        <span className="text-sm font-semibold text-[#490076]">{title}</span>
      </div>

      {/* Items + add button — directly inside the purple area */}
      <div className="flex flex-col gap-1 px-1 pb-1">
        {children}

        {/* Add button */}
        {onAdd && (
          <Button
            variant="ctaPurpleDark"
            className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-[clamp(0.8rem,2.5vw,0.95rem)] font-semibold text-center leading-snug lg:min-h-12 lg:py-2.5 lg:px-4 lg:text-[clamp(0.75rem,1.1vw,0.9rem)]"
            size="none"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RecapOptionItem                                                    */
/*                                                                     */
/*  White card for an option inside RecapSectionCard.                  */
/*  Left: title + description (80%). Right: close button + price.      */
/* ------------------------------------------------------------------ */

export interface RecapOptionItemProps {
  title: string;
  description: string;
  price: string;
  onRemove?: () => void;
  className?: string;
}

function RecapOptionItem({
  title,
  description,
  price,
  onRemove,
  className,
}: RecapOptionItemProps) {
  return (
    <div
      className={cn(
        "relative rounded-[24px] bg-white ring-1 ring-[#EADFF1] px-4 py-4",
        className,
      )}
    >
      {/* Close button — absolute top-right corner */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#490076] hover:bg-[#5a0a8f] transition-colors"
        >
          <X className="h-3 w-3 text-white" />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Left — title + description */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="font-bold text-[#490076] text-[1rem] leading-tight">
            {title}
          </div>
          <p className="text-[#05061D] text-[0.85rem] leading-snug mt-1.5">
            {description}
          </p>
        </div>

        {/* Right — price below close button area */}
        <div className="flex flex-col items-end shrink-0 mt-5">
          <div className="flex items-end gap-0.5">
            <span className="font-bold tracking-tight text-[#9000E3] text-lg leading-none">
              {price}
            </span>
            <span className="font-semibold text-[#490076] text-xs mb-0.5">
              /mois
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RecapBeneficiaryItem                                               */
/*                                                                     */
/*  White card for a beneficiary inside RecapSectionCard.              */
/*  Left: name + dob + tag. Right: close button.                       */
/* ------------------------------------------------------------------ */

export interface RecapBeneficiaryItemProps {
  /** Display name (e.g. "seif khelifi", "Conjoint(e)", "Enfant n°1") */
  name: string;
  /** Date of birth formatted as "DD / MM / YYYY" */
  dob: string;
  /** Tag label (e.g. "Bénéficiaire principal", "Rattaché à vous…") */
  tag: string;
  /** Whether this is the primary beneficiary (uses different colors) */
  isPrimary?: boolean;
  onRemove?: () => void;
  className?: string;
}

function RecapBeneficiaryItem({
  name,
  dob,
  tag,
  isPrimary = false,
  onRemove,
  className,
}: RecapBeneficiaryItemProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-white ring-1 ring-[#EADFF1] px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {/* Left — name + dob + tag */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#490076] text-[1rem] leading-tight">
              {name}
            </span>
          </div>

          <div className="mt-1.5">
            <span className="font-medium text-[#290E67] text-sm">{dob}</span>
          </div>

          <div className="mt-2">
            <span className="text-xs font-semibold text-[#9000E3]">
              {tag}
            </span>
          </div>
        </div>

        {/* Right — heart + close button (vertically centered) */}
        {onRemove && (
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src="/reacp/heart.svg"
              alt=""
              width={16}
              height={16}
              className="shrink-0"
            />
            <button
              type="button"
              onClick={onRemove}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#490076] hover:bg-[#5a0a8f] transition-colors"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { RecapSectionCard, RecapOptionItem, RecapBeneficiaryItem };
