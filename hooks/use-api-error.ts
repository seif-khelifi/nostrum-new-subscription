"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Error state for steps that handle API / non-zod errors manually.
 *
 * Follows the same display pattern as `useSelectionValidation` and
 * `useFormErrorToast`: inline text on mobile (< 640px) via `selectionError`
 * in StepScreen, Sonner toast on desktop (>= 640px).
 *
 * Usage:
 * ```ts
 * const { error, showError, clearError } = useApiError();
 * ```
 */
export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      toast.error(message, { duration: 4000 });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, showError, clearError } as const;
}
