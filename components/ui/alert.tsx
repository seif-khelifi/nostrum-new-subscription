import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-2xl border-0 px-4 py-3",
    "flex items-center justify-between gap-3",
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
      },
      size: {
        default: "min-h-[80px]",
        sm: "min-h-[56px] px-3 py-2",
        lg: "min-h-[96px] px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, size }), className)}
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
  className?: string;
};

function AlertVisual({
  icon,
  imageSrc,
  imageAlt = "Alert visual",
  className,
}: AlertVisualProps) {
  if (imageSrc) {
    return (
      <div
        data-slot="alert-visual"
        className={cn("shrink-0 flex items-center justify-center", className)}
      >
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
    visualClassName?: string;
    contentClassName?: string;
  };

function AlertBanner({
  title,
  subtitle,
  icon,
  imageSrc,
  imageAlt,
  variant,
  size,
  className,
  visualClassName,
  contentClassName,
  ...props
}: AlertBannerProps) {
  const resolvedIcon =
    icon === true ? DEFAULT_ALERT_ICON : icon === false ? undefined : icon;

  return (
    <Alert variant={variant} size={size} className={className} {...props}>
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
