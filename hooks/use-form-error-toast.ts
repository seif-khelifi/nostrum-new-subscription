"use client";

import { useEffect, useRef } from "react";
import { type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

/**
 * Shows a Sonner toast whenever new validation errors appear.
 * Tracks which error messages have already been shown to avoid duplicates.
 *
 * Pass the serialised error key as the second argument so React can detect changes
 * (the `errors` proxy object from react-hook-form doesn't change reference).
 */
export function useFormErrorToast(errors: FieldErrors, errorKey: string) {
	const prevKey = useRef("");

	useEffect(() => {
		// Nothing to show
		if (!errorKey) {
			prevKey.current = "";
			return;
		}

		// Only show toast when errors actually changed
		if (errorKey === prevKey.current) return;
		prevKey.current = errorKey;

		const messages = Object.values(errors)
			.map((e) => e?.message)
			.filter(Boolean) as string[];

		if (messages.length > 0) {
			toast.error(messages.join(" • "), { duration: 4000 });
		}
	}, [errors, errorKey]);
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
