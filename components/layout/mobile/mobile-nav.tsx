import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./mobile-nav.css";

export interface MobileNavProps {
	/** Navigation items rendered inside the bottom bar */
	children?: ReactNode;
	className?: string;
}

/**
 * Mobile bottom navigation bar.
 * Renders a fixed bar at the bottom of the viewport with navigation items.
 */
export function MobileNav({ children, className }: MobileNavProps) {
	return <nav className={cn("mobile-nav", className)}>{children}</nav>;
}
