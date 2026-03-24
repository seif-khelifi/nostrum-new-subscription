"use client";

import { type ReactNode } from "react";
import { DesktopSidebar } from "./sidebar";
import { cn } from "@/lib/utils";
import { useStepper } from "@/context/StepperContext";
import "./desktop-shell.css";

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
 */
export function DesktopShell({
	title,
	sidebarContent,
	navbarActions,
	customNavbar,
	children,
}: DesktopShellProps) {
	const { currentGroup } = useStepper();

	/* Hide sidebar on the Devis step (group 5) */
	const hideSidebar = currentGroup.id === 5;

	return (
		<div className="hidden sm:flex h-screen">
			{!hideSidebar && <DesktopSidebar>{sidebarContent}</DesktopSidebar>}

			<div
				className={cn(
					"flex flex-col flex-1 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
					hideSidebar ? "ml-0" : "sm:ml-[120px] lg:ml-64",
				)}
			>
				{customNavbar ?? (
					<header className="desktop-navbar">
						<div>
							{title && <span className="desktop-navbar__title">{title}</span>}
						</div>
						{navbarActions && <div>{navbarActions}</div>}
					</header>
				)}

				<main data-slot="desktop-main" className={cn("flex-1 overflow-y-auto p-6", hideSidebar && "bg-white")}>
					{children}
				</main>
			</div>
		</div>
	);
}
