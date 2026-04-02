export type {
  VariantConfig,
  VariantKey,
  StepTexts,
  BannerConfig,
  StepId,
  StepDef,
  StepGroup,
} from "./types";
export { variantA } from "./variant-a";
export { variantB } from "./variant-b";

import type { VariantConfig, VariantKey } from "./types";
import { variantA } from "./variant-a";
import { variantB } from "./variant-b";

const VARIANT_MAP: Record<VariantKey, VariantConfig> = {
  a: variantA,
  b: variantB,
};

/** Resolve a variant config by key. Falls back to variant A for unknown keys. */
export function resolveVariant(key: VariantKey): VariantConfig {
  return VARIANT_MAP[key] ?? variantA;
}
