"use client";

import { InfoIcon } from "lucide-react";
import { AlertBanner } from "@/components/ui/alert";
import type { BannerConfig } from "@/config";

interface VariantBannerProps {
  config: BannerConfig;
  className?: string;
}

/**
 * Renders an AlertBanner from a variant BannerConfig object.
 *
 * This is a thin adapter so step components don't need to manually
 * map config fields to AlertBanner props. Easy to remove once the
 * variant system stabilizes — just inline the AlertBanner calls.
 */
export function VariantBanner({ config, className }: VariantBannerProps) {
  /* AlertBannerProps.title intersects React.ComponentProps<"div">["title"] (string)
	   with { title: React.ReactNode }, creating a narrow type. We spread via a
	   plain object to avoid the TS intersection issue. */
  const props = {
    variant: config.variant ?? ("default" as const),
    title: config.title,
    subtitle: config.subtitle,
    icon: config.icon ? (
      <InfoIcon className="size-5 text-[#9000E3]" />
    ) : undefined,
    imageSrc: config.imageSrc,
    imageAlt: config.imageAlt,
    className,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <AlertBanner {...(props as any)} />;
}
