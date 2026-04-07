"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

const DEFAULT_MESSAGE = "Veuillez sélectionner une option";

/**
 * Validation hook for button-selection steps.
 *
 * Returns an error message (shown inline on mobile) and a `validate` function
 * that should be called from `onNext`. On desktop (>=640 px) a Sonner toast
 * is shown; on mobile the inline error in StepScreen handles it.
 *
 * The error is automatically cleared when the selected value changes.
 */
export function useSelectionValidation(
  selected: unknown,
  message = DEFAULT_MESSAGE,
) {
  const [error, setError] = useState<string | null>(null);
  const attemptRef = useRef(0);

  // Clear error when the user makes a selection
  useEffect(() => {
    if (selected !== null && selected !== undefined) {
      setError(null);
    }
  }, [selected]);

  const validate = useCallback((): boolean => {
    if (selected === null || selected === undefined) {
      setError(message);
      attemptRef.current += 1;

      // Show toast on desktop (sm+ = 640px), matching form error toast behaviour
      if (typeof window !== "undefined" && window.innerWidth >= 640) {
        toast.error(message, { duration: 4000 });
      }

      return false;
    }
    return true;
  }, [selected, message]);

  return { error, validate } as const;
}
