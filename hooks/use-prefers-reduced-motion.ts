"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when the user has requested reduced motion.
 *
 * Listens to the `prefers-reduced-motion` media query so changes
 * made via OS settings during a session are picked up live.
 *
 * Most animations are CSS-only and already neutralized by the
 * global `@media (prefers-reduced-motion: reduce)` rule in
 * `globals.css`. Use this hook only for JS-driven sequences
 * (e.g. embla autoplay, staggered delays computed in JS).
 */
export function usePrefersReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mql.matches);

		const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return reduced;
}
