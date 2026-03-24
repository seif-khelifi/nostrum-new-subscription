import { type ReactNode } from "react";
import { MobileNav } from "./mobile-nav";

export interface MobileShellProps {
	/** Custom header element (e.g., MobileStepNavbar) */
	customHeader?: ReactNode;
	/** Bottom navigation items — nav bar hidden when omitted */
	navItems?: ReactNode;
	/** Main page content */
	children: ReactNode;
}

/**
 * Mobile layout shell.
 * Renders an optional top header and a fixed bottom navigation,
 * with the page content scrollable between them.
 *
 * Hidden on viewports >= sm breakpoint (640px).
 */
export function MobileShell({
	customHeader,
	navItems,
	children,
}: MobileShellProps) {
	return (
		<div className="flex flex-col h-screen sm:hidden">
			{customHeader}

			<main data-slot="mobile-main" className={`flex-1 overflow-y-auto p-4${navItems ? " pb-14" : ""}`}>
				{children}
			</main>

			{navItems && <MobileNav>{navItems}</MobileNav>}
		</div>
	);
}
