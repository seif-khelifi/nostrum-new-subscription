import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./mobile-header.css";

export interface MobileHeaderProps {
	/** Logo or brand element; defaults to "Nostrum" text */
	logo?: ReactNode;
	/** Right-side action buttons (e.g., menu toggle, avatar) */
	actions?: ReactNode;
	className?: string;
}

/**
 * Mobile top header bar with logo and optional action buttons.
 */
export function MobileHeader({ logo, actions, className }: MobileHeaderProps) {
	return (
		<header className={cn("mobile-header", className)}>
			<div className="mobile-header__logo">{logo ?? <span>Nostrum</span>}</div>

			{actions && <div className="mobile-header__actions">{actions}</div>}
		</header>
	);
}
