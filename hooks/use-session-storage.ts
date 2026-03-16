"use client";

import { useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(initialValue);
	const [isReady, setIsReady] = useState(false);

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

	const setStoredValue = (newValue: T) => {
		setValue(newValue);

		try {
			window.sessionStorage.setItem(key, JSON.stringify(newValue));
		} catch (error) {
			console.error(`Failed to write sessionStorage key "${key}"`, error);
		}
	};

	const removeStoredValue = () => {
		setValue(initialValue);

		try {
			window.sessionStorage.removeItem(key);
		} catch (error) {
			console.error(`Failed to remove sessionStorage key "${key}"`, error);
		}
	};

	return {
		value,
		setValue: setStoredValue,
		removeValue: removeStoredValue,
		isReady,
	};
}
