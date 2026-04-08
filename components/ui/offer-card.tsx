import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronRight, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/*  CVA variant definitions                                           */
/* ------------------------------------------------------------------ */

const offerCardVariants = cva("", {
  variants: {
    tone: {
      default: "",
      recommended: "",
    },
    size: {
      default: "",
      sm: "",
    },
    selected: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "default",
    selected: false,
  },
})

const offerInnerCardVariants = cva(
  [
    "overflow-hidden border-0 bg-white shadow-none",
    "gap-0 rounded-[24px]",
  ].join(" "),
  {
    variants: {
      tone: {
        default: "ring-1 ring-[#EADFF1]",
        recommended: "ring-0",
      },
      size: {
        default: "px-0 py-0",
        sm: "px-0 py-0 rounded-[20px]",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "default",
    },
  }
)

/* ------------------------------------------------------------------ */
/*  Plan type (re-exported from single source of truth)                */
/* ------------------------------------------------------------------ */

import type { OfferPlan } from "@/lib/plans"

/* ------------------------------------------------------------------ */
/*  OfferCard public props                                            */
/* ------------------------------------------------------------------ */

export interface OfferCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof offerCardVariants> {
  plan: OfferPlan
  price: string
  period?: string
  badgeTitle?: string
  recommendedLabel?: string
  selected?: boolean
  logo?: React.ReactNode
  descriptionTitle: React.ReactNode
  description: React.ReactNode
  ctaLabel?: React.ReactNode
  onCtaClick?: () => void
  /** Label shown in the gradient footer for recommended cards */
  moreLabel?: string
  /** Handler for the "En savoir plus" link (recommended gradient footer) */
  onMoreClick?: () => void
  /** Hide the CTA button — use for summary/preview mode */
  hideCta?: boolean
  /** Show a loading spinner on the CTA button and disable it */
  loading?: boolean
  /** Optional extra content rendered inside the white card, below the description */
  footer?: React.ReactNode
}

/* ------------------------------------------------------------------ */
/*  OfferCard (outer)                                                 */
/* ------------------------------------------------------------------ */

function OfferCard({
  className,
  tone = "default",
  size = "default",
  plan,
  price,
  period = "/mois",
  badgeTitle = "Recommandé pour vous",
  recommendedLabel,
  selected = false,
  logo,
  descriptionTitle,
  description,
  ctaLabel,
  onCtaClick,
  moreLabel = "En savoir plus",
  onMoreClick,
  hideCta = false,
  loading = false,
  footer,
  ...props
}: OfferCardProps) {
  const isRecommended = tone === "recommended"
  const resolvedTone = tone ?? "default"
  const resolvedSize = size ?? "default"

  const innerProps: OfferInnerCardProps = {
    tone: resolvedTone,
    size: resolvedSize,
    plan,
    price,
    period,
    selected,
    recommendedLabel,
    logo,
    descriptionTitle,
    description,
    ctaLabel,
    onCtaClick,
    hideCta,
    loading,
    footer,
  }

  return (
    <div
      className={cn(
        offerCardVariants({ tone, size, selected }),
        "w-full",
        className,
      )}
      {...props}
    >
      {isRecommended ? (
        /* Recommended: gradient border wrapper */
        <div
          className={cn(
            "rounded-[28px] p-[3px]",
            "bg-[radial-gradient(178.77%_98.49%_at_50.14%_97.13%,#FBF4EA_0%,#FEA8CD_34.13%,#FEB1D0_47.45%,#CE99FF_62.98%,#9000E3_80.77%,#490076_100%)]"
          )}
        >
          <div className="rounded-[25px] bg-transparent">
            {/* Badge row — top of gradient */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <span className="text-sm font-semibold text-white">
                {badgeTitle}
              </span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <Check className="h-3.5 w-3.5 text-[#6E00B3]" strokeWidth={3} />
              </div>
            </div>

            {/* White inner card */}
            <OfferInnerCard {...innerProps} />

            {/* "En savoir plus" — bottom of gradient, outside white card */}
            {onMoreClick && (
              <div className="flex items-center justify-center px-5 pt-3 pb-4">
                <button
                  type="button"
                  onClick={onMoreClick}
                  className="inline-flex items-center gap-1 text-sm font-medium text-white transition-all hover:opacity-80 active:scale-95 active:opacity-60"
                >
                  {moreLabel}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <OfferInnerCard {...innerProps} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  OfferInnerCard (white card body — no "En savoir plus")            */
/* ------------------------------------------------------------------ */

type OfferInnerCardProps = {
  tone?: "default" | "recommended"
  size?: "default" | "sm"
  plan: OfferPlan
  price: string
  period: string
  selected?: boolean
  recommendedLabel?: string
  logo?: React.ReactNode
  descriptionTitle: React.ReactNode
  description: React.ReactNode
  ctaLabel?: React.ReactNode
  onCtaClick?: () => void
  /** Hide the CTA button — use for summary/preview mode */
  hideCta?: boolean
  /** Show a loading spinner on the CTA button and disable it */
  loading?: boolean
  /** Optional extra content rendered below the description */
  footer?: React.ReactNode
}

function OfferInnerCard({
  tone = "default",
  size = "default",
  plan,
  price,
  period,
  logo,
  descriptionTitle,
  description,
  ctaLabel,
  onCtaClick,
  hideCta = false,
  loading = false,
  footer,
}: OfferInnerCardProps) {
  const isSm = size === "sm"

  return (
    <Card className={cn(offerInnerCardVariants({ tone, size }))}>
      <CardHeader
        className={cn(
          "gap-4",
          isSm ? "px-4 pt-4 pb-2" : "px-5 pt-5 pb-3"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Plan name + price — default font (Inter), bold */}
          <div className="min-w-0">
            <CardTitle
              className={cn(
                "capitalize font-bold text-[#490076]",
                isSm ? "text-sm" : "text-[1.1rem] leading-none"
              )}
            >
              {plan}
            </CardTitle>

            <div className="mt-1 flex items-end gap-0.5">
              <span
                className={cn(
                  "font-bold tracking-tight text-[#9000E3]",
                  isSm
                    ? "text-[1.75rem] leading-none"
                    : "text-[2rem] leading-none"
                )}
              >
                {price}
              </span>
              <span
                className={cn(
                  "font-semibold text-[#490076]",
                  isSm ? "mb-0.5 text-xs" : "mb-0.5 text-sm"
                )}
              >
                {period}
              </span>
            </div>
          </div>

          {/* Logo — rendered directly, no badge background */}
          <div className="shrink-0">
            {logo ?? <span className="text-sm text-[#490076]">logo</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "flex flex-col",
          isSm ? "gap-4 px-4 pb-4" : "gap-5 px-5 pb-5"
        )}
      >
        {/* CTA button — bulkier on mobile, generous padding on desktop */}
        {!hideCta && ctaLabel && (
          <Button
            variant="ctaPurpleDark"
            size="cta"
            className="w-full rounded-[20px] min-h-[52px] h-auto py-3 text-[clamp(0.8rem,2.5vw,0.95rem)] font-semibold text-center leading-snug lg:min-h-12 lg:py-2.5 lg:px-4 lg:text-[clamp(0.75rem,1.1vw,0.9rem)]"
            onClick={onCtaClick}
            loading={loading}
          >
            {ctaLabel}
          </Button>
        )}

        {/* Description block — generous spacing above */}
        <div className="text-center mt-4 lg:mt-6">
          <div
            className={cn(
              "font-bold text-[#490076]",
              isSm
                ? "text-[0.95rem] leading-5"
                : "text-[1rem] leading-6"
            )}
          >
            {descriptionTitle}
          </div>

          <p
            className={cn(
              "mx-auto mt-1.5 max-w-[28ch] text-[#490076]",
              isSm
                ? "text-[0.85rem] leading-snug"
                : "text-[0.9rem] leading-snug"
            )}
          >
            {description}
          </p>
        </div>

        {/* Optional footer content (e.g. advantages accordion) */}
        {footer}
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  CompareCard — gradient background card with white text + white    */
/*  button (purple text). "Et si vous compariez ?"                    */
/* ------------------------------------------------------------------ */

export interface CompareCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Visual variant: gradient (default) or solid dark */
  variant?: "gradient" | "dark"
  /** Layout: stacked (default) or inline (text + button side by side) */
  layout?: "stacked" | "inline"
  title: React.ReactNode
  description: React.ReactNode
  ctaLabel: React.ReactNode
  onCtaClick?: () => void
  buttonClassName?: string
}

function CompareCard({
  className,
  variant = "gradient",
  layout = "stacked",
  title,
  description,
  ctaLabel,
  onCtaClick,
  buttonClassName,
  ...props
}: CompareCardProps) {
  const isDark = variant === "dark"
  const isInline = layout === "inline"

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[24px] p-6",
        isDark
          ? "bg-black"
          : "bg-[radial-gradient(172.35%_94.95%_at_100%_97.29%,#FBF4EA_0%,#FEA8CD_41.57%,#CE99FF_57.09%,#9000E3_80.77%,#490076_97.75%)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          isInline
            ? "flex items-center gap-6"
            : "flex flex-col gap-4",
        )}
      >
        {/* Text block — Inter font explicitly */}
        <div className={cn("font-sans", isInline ? "min-w-0 flex-1" : "contents")}>
          {/* Title */}
          <p className={cn(
            "font-bold leading-tight text-white",
            isInline ? "text-2xl" : "text-xl",
          )}>
            {title}
          </p>

          {/* Description */}
          <p className={cn(
            "leading-snug text-white/90",
            isInline ? "mt-1.5 text-sm" : "text-sm",
          )}>
            {description}
          </p>
        </div>

        {/* White CTA button */}
        <Button
          variant="default"
          className={cn(
            "rounded-[20px] border-0 bg-white",
            "min-h-[48px] h-auto py-3 text-sm font-semibold",
            "shadow-none hover:bg-white/90",
            "lg:min-h-11",
            isDark ? "text-black" : "text-[#490076]",
            isInline ? "shrink-0 px-6" : "w-full",
            buttonClassName
          )}
          onClick={onCtaClick}
        >
          {ctaLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  OfferCardMoreFooter — coloured footer for mobile default cards    */
/*  Inverse of the recommended badge: #F3E5FA bg at bottom with       */
/*  "En savoir plus" link.                                            */
/* ------------------------------------------------------------------ */

function OfferCardMoreFooter({
  children,
  moreLabel = "En savoir plus",
  onMoreClick,
  className,
}: {
  children: React.ReactNode
  moreLabel?: string
  onMoreClick?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] bg-[#F3E5FA] p-[3px] pb-0 overflow-hidden",
        className,
      )}
    >
      {/* Card body */}
      <div className="rounded-t-[25px]">{children}</div>

      {/* Footer link area */}
      {onMoreClick && (
        <div className="flex items-center justify-center px-5 pt-3 pb-4">
          <button
            type="button"
            onClick={onMoreClick}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#490076] transition-all hover:opacity-80 active:scale-95 active:opacity-60"
          >
            {moreLabel}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  OfferCardHoverGroup — desktop wrapper using same card content as  */
/*  mobile. On hover: #F3E5FA bg + "En savoir plus" footer appears.   */
/*  Card content stays identical (no size change = smooth transition). */
/* ------------------------------------------------------------------ */

function OfferCardHoverGroup({
  children,
  moreLabel = "En savoir plus",
  onMoreClick,
  className,
}: {
  children: React.ReactNode
  moreLabel?: string
  onMoreClick?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "group/offer rounded-[28px] p-[3px] pb-0 overflow-hidden transition-colors duration-200",
        "bg-transparent hover:bg-[#F3E5FA]",
        className,
      )}
    >
      <div className="rounded-t-[25px]">{children}</div>

      {/* Footer — hidden by default, slides in on hover */}
      {onMoreClick && (
        <div className="grid grid-rows-[0fr] group-hover/offer:grid-rows-[1fr] transition-[grid-template-rows] duration-200">
          <div className="overflow-hidden">
            <div className="flex items-center justify-center px-5 pt-3 pb-4">
              <button
                type="button"
                onClick={onMoreClick}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#490076] transition-opacity hover:opacity-80"
              >
                {moreLabel}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export {
  OfferCard,
  CompareCard,
  OfferCardMoreFooter,
  OfferCardHoverGroup,
  offerCardVariants,
}
export type { OfferPlan }
