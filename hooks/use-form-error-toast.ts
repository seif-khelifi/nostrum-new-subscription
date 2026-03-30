"use client";

import { useEffect, useRef } from "react";
import { type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

/**
 * Shows a Sonner toast whenever new validation errors appear.
 *
 * Tracks which error messages have already been shown so the same set
 * isn't toasted twice in a row, but *will* re-toast if the user
 * triggers validation again (e.g. by clicking "Suivant").
 *
 * `submitCount` from `formState` is used to detect re-submissions
 * so the toast fires even when the error set hasn't changed.
 */
export function useFormErrorToast(
  errors: FieldErrors,
  errKey: string,
  submitCount: number,
) {
  const prevKey = useRef("");
  const prevSubmitCount = useRef(0);

  useEffect(() => {
    // On mobile (< sm = 640px) skip toasts — the inline sentence in StepScreen handles it
    if (typeof window !== "undefined" && window.innerWidth < 640) return;

    // Nothing to show
    if (!errKey) {
      prevKey.current = "";
      return;
    }

    // Show toast when errors changed OR when a new submit attempt occurred
    const errorsChanged = errKey !== prevKey.current;
    const newSubmit = submitCount > prevSubmitCount.current;

    if (!errorsChanged && !newSubmit) return;

    prevKey.current = errKey;
    prevSubmitCount.current = submitCount;

    const messages = Object.values(errors)
      .map((e) => e?.message)
      .filter(Boolean) as string[];

    if (messages.length > 0) {
      toast.error(messages.join(" • "), { duration: 4000 });
    }
  }, [errors, errKey, submitCount]);
}

/**
 * Helper to build a stable string key from FieldErrors.
 * Use this as the second argument to useFormErrorToast.
 */
export function errorKey(errors: FieldErrors): string {
  return Object.entries(errors)
    .map(([k, v]) => `${k}:${v?.message ?? ""}`)
    .sort()
    .join("|");
}
