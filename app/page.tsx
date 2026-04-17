"use client";

import { useState, useEffect } from "react";
import { DesktopShell } from "@/components/layout/desktop";
import { MobileShell } from "@/components/layout/mobile";
import { StepRouter } from "@/components/steps/step-router";
import { StepNavbar } from "@/components/steps/step-navbar";
import { MobileStepNavbar } from "@/components/steps/mobile-step-navbar";

/* ------------------------------------------------------------------ */
/*  Breakpoint-aware shell                                             */
/*                                                                     */
/*  After hydration only one shell is mounted, so every child          */
/*  component (including those with mount-time API calls) exists as    */
/*  a single React instance. On resize across the breakpoint the       */
/*  active shell switches automatically.                               */
/* ------------------------------------------------------------------ */

export default function Home() {
	const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

	useEffect(() => {
		const mql = window.matchMedia("(min-width: 640px)");
		setIsDesktop(mql.matches);

		function onChange(e: MediaQueryListEvent) {
			setIsDesktop(e.matches);
		}
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	/* Before hydration (SSR + first client paint): render nothing.
	   This page is fully client-side (behind auth / stepper state),
	   so there is no SEO content to preserve. The shell appears
	   as soon as the first useEffect fires (< 1 frame). */
	if (isDesktop === null) return null;

	return isDesktop ? (
		<DesktopShell customNavbar={<StepNavbar />}>
			<StepRouter />
		</DesktopShell>
	) : (
		<MobileShell customHeader={<MobileStepNavbar />}>
			<StepRouter />
		</MobileShell>
	);
}
