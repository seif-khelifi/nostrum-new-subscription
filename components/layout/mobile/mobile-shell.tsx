import { type ReactNode } from "react";
import { MobileHeader } from "./mobile-header";
import { MobileNav } from "./mobile-nav";

export interface MobileShellProps {
	/** Optional logo/brand for the header */
	logo?: ReactNode;
	/** Right-side header actions (e.g., menu toggle) */
	headerActions?: ReactNode;
	/** Bottom navigation items */
	navItems?: ReactNode;
	/** Main page content */
	children: ReactNode;
}

/**
 * Mobile layout shell.
 * Renders a top header bar and a fixed bottom navigation,
 * with the page content scrollable between them.
 *
 * Hidden on viewports >= sm breakpoint (640px).
 */
export function MobileShell({
	logo,
	headerActions,
	navItems,
	children,
}: MobileShellProps) {
	return (
		<div className="flex flex-col h-screen sm:hidden">
			<MobileHeader logo={logo} actions={headerActions} />

			{/* pb-14 accounts for the fixed bottom nav height */}
			<main className="flex-1 overflow-y-auto p-4 pb-14">{children}</main>

			<MobileNav>{navItems}</MobileNav>
		</div>
	);
}
