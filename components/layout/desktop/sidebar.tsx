import { type ReactNode } from "react";
import { AppSidebar } from "@/components/wrappers/sidebar";

export interface DesktopSidebarProps {
	logo?: ReactNode;
	collapsedLogo?: ReactNode;
	children?: ReactNode;
}

export function DesktopSidebar({
	logo,
	collapsedLogo,
	children,
}: DesktopSidebarProps) {
	return (
		<AppSidebar logo={logo} collapsedLogo={collapsedLogo}>
			{children}
		</AppSidebar>
	);
}
