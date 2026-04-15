"use client";

import { type ReactNode } from "react";
import { SidebarVariantA } from "./sidebar-variant-a";
import { SidebarVariantB } from "./sidebar-variant-b";
import { DesktopSidebarRight } from "./sidebar-right";
import { cn } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import { useVariant } from "@/context/VariantContext";

export interface DesktopShellProps {
	/** Page title shown in the navbar */
	title?: string;
	/** Optional sidebar content (nav links, etc.) */
	sidebarContent?: ReactNode;
	/** Optional navbar action buttons */
	navbarActions?: ReactNode;
	/** Completely replaces the default navbar when provided */
	customNavbar?: ReactNode;
	/** Main page content */
	children: ReactNode;
}

/**
 * Desktop layout shell.
 * Renders a fixed sidebar on the left and a top navbar,
 * with the page content scrollable in the remaining space.
 *
 * - lg+: full sidebar (16rem)
 * - sm → lg: collapsed sidebar (120px, icon-only)
 * - < sm: hidden entirely (mobile shell takes over)
 *
 * Sidebar is hidden for certain steps (e.g. Devis) to allow
 * full-width content layouts.
 *
 * Reads layout config from the variant to decide:
 * - Which left sidebar to render (variant A = purple, variant B = default)
 * - Whether to show the right sidebar (variant A only)
 */
export function DesktopShell({
	title,
	sidebarContent,
	navbarActions,
	customNavbar,
	children,
}: DesktopShellProps) {
	const { currentGroup, currentStepDef } = useStepper();
	const { id: variantId, layout } = useVariant();

	/* Hide sidebar on the Devis step (group 5), except for "options" and
	   "devis_recap" which use the standard layout with sidebars visible. */
	const hideSidebar =
		currentGroup.id === 5 &&
		currentStepDef.id !== "options" &&
		currentStepDef.id !== "devis_recap";

	/* Right sidebar — driven by layout config */
	const showRightSidebar = layout.sidebar.showRightSidebar && !hideSidebar;

	/* Pick the correct left sidebar component */
	const LeftSidebar = variantId === "a" ? SidebarVariantA : SidebarVariantB;

	return (
		<div className="hidden sm:flex h-screen">
			{!hideSidebar && <LeftSidebar />}

			{/* Right sidebar — variant A only, hidden when left sidebar collapses (below lg) */}
			{showRightSidebar && <DesktopSidebarRight />}

			<div
				className={cn(
					"flex flex-col flex-1 transition-[margin-left,margin-right] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
					hideSidebar
					? variantId === "a"
						? "ml-0 bg-[#FFFFFF]"
						: "ml-0 bg-[#F6F4F0]"
					: "sm:ml-[120px] lg:ml-64",
					/* Right sidebar margin — only at lg+ */
					showRightSidebar ? "lg:mr-72 xl:mr-80" : "",
				)}
			>
				{customNavbar ?? (
					<header className="flex items-center justify-between h-16 px-6 bg-background">
						<div>
							{title && (
								<span className="font-[family-name:var(--font-bricolage)] text-lg font-bold tracking-tight">
									{title}
								</span>
							)}
						</div>
						{navbarActions && <div>{navbarActions}</div>}
					</header>
				)}

				<main
					data-slot="desktop-main"
					className="flex-1 overflow-y-auto overflow-x-clip p-6"
				>
					{" "}
					{children}
				</main>
			</div>
		</div>
	);
}
