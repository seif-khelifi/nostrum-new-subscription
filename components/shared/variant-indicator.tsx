"use client";

import { useVariant } from "@/context/VariantContext";

export function VariantIndicator() {
  const { id } = useVariant();

  return (
    <div className="sticky top-0 z-[9999] flex items-center justify-center gap-2 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white">
      <span className="opacity-60">Variant served:</span>
      <span className="rounded bg-white/20 px-2 py-0.5 font-bold uppercase tracking-wider">
        {id}
      </span>
    </div>
  );
}
