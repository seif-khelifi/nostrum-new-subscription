"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Custom event name used to sync `useSessionStorage` instances that share
 * the same key across different component trees (e.g. main content ↔ sidebar).
 */
const SYNC_EVENT = "session-storage-sync";

export function useSessionStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(initialValue);
	const [isReady, setIsReady] = useState(false);

	/* ── Read from storage on mount ── */
	useEffect(() => {
		try {
			const item = window.sessionStorage.getItem(key);

			if (item !== null) {
				setValue(JSON.parse(item) as T);
			}
		} catch (error) {
			console.error(`Failed to read sessionStorage key "${key}"`, error);
		} finally {
			setIsReady(true);
		}
	}, [key]);

	/* ── Listen for writes from other hook instances on the same key ── */
	useEffect(() => {
		const handler = (e: Event) => {
			const { detail } = e as CustomEvent<{ key: string; value: T }>;
			if (detail.key === key) {
				setValue(detail.value);
			}
		};
		window.addEventListener(SYNC_EVENT, handler);
		return () => window.removeEventListener(SYNC_EVENT, handler);
	}, [key]);

	const setStoredValue = useCallback(
		(newValue: T) => {
			setValue(newValue);

			try {
				window.sessionStorage.setItem(key, JSON.stringify(newValue));
			} catch (error) {
				console.error(`Failed to write sessionStorage key "${key}"`, error);
			}

			/* Notify other hook instances so they re-render with the new value */
			window.dispatchEvent(
				new CustomEvent(SYNC_EVENT, { detail: { key, value: newValue } }),
			);
		},
		[key],
	);

	const removeStoredValue = useCallback(() => {
		setValue(initialValue);

		try {
			window.sessionStorage.removeItem(key);
		} catch (error) {
			console.error(`Failed to remove sessionStorage key "${key}"`, error);
		}

		window.dispatchEvent(
			new CustomEvent(SYNC_EVENT, { detail: { key, value: initialValue } }),
		);
	}, [key, initialValue]);

	return {
		value,
		setValue: setStoredValue,
		removeValue: removeStoredValue,
		isReady,
	};
}
