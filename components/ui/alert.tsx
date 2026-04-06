import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-2xl border-0 px-4 py-3",
    "bg-[linear-gradient(180deg,#F3E5FA_0%,#FBF4EA_100%)]",
    "shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        success: "",
        info: "",
        warning: "",
        destructive: "",
        comparateurDark:
          "bg-[#1A002A] bg-none rounded-xl",
        sidebarDark:
          "bg-[#490076] bg-none rounded-xl",
      },
      size: {
        default: "min-h-[80px]",
        sm: "min-h-[56px] px-3 py-2",
        lg: "min-h-[96px] px-5 py-4",
      },
      layout: {
        /** Default: text + image side by side */
        inline: "flex items-center justify-between gap-3",
        /**
         * Responsive: side-by-side when container is wide enough,
         * stacks image below text when squeezed.
         * Uses a CSS container query via @container.
         */
        responsive: "flex flex-col gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      layout: "inline",
    },
  },
);

const alertTitleVariants = cva("text-base font-bold leading-5", {
  variants: {
    variant: {
      default: "text-[#490076]",
      success: "text-[#490076]",
      info: "text-[#490076]",
      warning: "text-[#490076]",
      destructive: "text-[#490076]",
      comparateurDark: "text-white",
      sidebarDark: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDescriptionVariants = cva("text-sm leading-5", {
  variants: {
    variant: {
      default: "text-[#490076]",
      success: "text-[#490076]",
      info: "text-[#490076]",
      warning: "text-[#490076]",
      destructive: "text-[#490076]",
      comparateurDark: "text-white",
      sidebarDark: "text-white/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Alert({
  className,
  variant,
  size,
  layout,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, size, layout }), className)}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertTitleVariants>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(alertTitleVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertDescriptionVariants>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(alertDescriptionVariants({ variant }), className)}
      {...props}
    />
  );
}

type AlertVisualProps = {
  icon?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** When true, image fills its container with small edge margins */
  fill?: boolean;
  className?: string;
};

function AlertVisual({
  icon,
  imageSrc,
  imageAlt = "Alert visual",
  fill,
  className,
}: AlertVisualProps) {
  if (imageSrc) {
    if (fill) {
      return (
        <div
          data-slot="alert-visual"
          className={cn(
            "relative overflow-hidden rounded-lg",
            "mx-1 mb-1",
            className,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div
        data-slot="alert-visual"
        className={cn("shrink-0 flex items-center justify-center", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full max-h-24 w-auto object-contain"
        />
      </div>
    );
  }

  if (!icon) return null;

  return (
    <div
      data-slot="alert-visual"
      className={cn(
        "shrink-0 flex items-center justify-center",
        "size-5",
        className,
      )}
    >
      {icon}
    </div>
  );
}

/** Default icon rendered when `icon` is `true` */
const DEFAULT_ALERT_ICON = (
  <InfoIcon className="size-5 text-[#9000E3]" />
);

type AlertBannerProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    /** Pass `true` for the default info icon, or a custom ReactNode */
    icon?: boolean | React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    /** When true, the image fills its container (used in sidebar cards) */
    imageFill?: boolean;
    visualClassName?: string;
    contentClassName?: string;
  };

function AlertBanner({
  title,
  subtitle,
  icon,
  imageSrc,
  imageAlt,
  imageFill,
  variant,
  size,
  layout,
  className,
  visualClassName,
  contentClassName,
  ...props
}: AlertBannerProps) {
  const resolvedIcon =
    icon === true ? DEFAULT_ALERT_ICON : icon === false ? undefined : icon;

  return (
    <Alert variant={variant} size={size} layout={layout} className={className} {...props}>
      <div className={cn("min-w-0 flex-1", contentClassName)}>
        <AlertTitle variant={variant}>{title}</AlertTitle>
        {subtitle ? (
          <AlertDescription variant={variant} className="mt-0.5">
            {subtitle}
          </AlertDescription>
        ) : null}
      </div>

      <AlertVisual
        icon={resolvedIcon}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        fill={imageFill}
        className={visualClassName}
      />
    </Alert>
  );
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertVisual,
  AlertBanner,
  alertVariants,
};
